jest.mock('../models/cryptoModel')
jest.mock('axios')
jest.mock('../controller/authController', () => {
    const actualAuthController = jest.requireActual('../controller/authController');
    
    return {
        ...actualAuthController,
        protect: (req, res, next) => next(),
        restrictTo: () => (req, res, next) => next()
    };
})
jest.mock('multer', () => {
    const multer = jest.fn(() => ({
        single: jest.fn(() => (req, res, next) => {
            req.file = { filename: 'mocked-image.png' }; // Simulate an uploaded file
            next();
        }),
    }));
    multer.diskStorage = jest.fn(() => ({
        destination: (req, file, cb) => cb(null, './uploads'),
        filename: (req, file, cb) => cb(null, file.originalname),
    }));
    return multer;
});



const axios = require("axios")
const request = require('supertest')
const app = require('../app')
const Crypto =require('../models/cryptoModel')
const fs = require("fs")

jest.mock("fs")

describe("Crypto Create" ,() => {
    it('should return an error if the crypto name is invalid ', async() => {
        axios.get.mockResolvedValue({ data: {Response: "Error"} })

        const res = await request(app)
            .post('/crypto')
            .send({name: "invalid-crypto"})

        expect(res.status).toBe(404)
        expect(res.body.message).toBe("wrong Crypto Name or Price")
    });

    it('should create a new crypto entry and return success', async() => {
        axios.get.mockResolvedValueOnce({ data: { USD: 4000 ,Response: "success" }});
        axios.get.mockResolvedValueOnce({ data: { currency: [{ price: '60' }] } });

        Crypto.create = jest.fn().mockResolvedValue({
            name: 'BTC',
            price: 240000,
            image: null
        });

        const response = await request(app)
                .post('/crypto')
                .send({ name: 'BTC'})
                .expect(201)

        expect(response.body.status).toBe('success');
        expect(response.body.crypto).toHaveProperty('name', 'BTC');
        expect(response.body.crypto).toHaveProperty('price', 240000);
    });
})

describe("Crypto showall" ,() => {
    it('should get crypto', async() => {
        Crypto.find.mockResolvedValue({
            name: 'BTC',
            price: 60000
        })

        const res = await request(app)
            .get('/crypto')
        
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("crypto")
    });

    it('should get no data to show', async() => {
        Crypto.find.mockResolvedValue([])

        const res = await request(app)
            .get('/crypto')
        

        expect(res.status).toBe(200)
        expect(res.body.crypto).toBe("no data to show")
    });
})

describe("Crypto remove" ,() => {
    it('should remove a crypto with 204', async() => {
        Crypto.findOne.mockResolvedValue({
            name: 'BTC',
            price: 60000,
            image: "BTC.png"
        })
        Crypto.deleteOne.mockResolvedValue({ deletedCount: 1 })

        fs.unlinkSync.mockResolvedValue()

        const res = await request(app)
            .delete('/crypto/btc')

        expect(fs.unlinkSync).toHaveBeenCalledWith('./uploads/BTC.png');
        expect(res.status).toBe(204);
    });

    it('should return no Crypto found with 404', async() => {
        Crypto.findOne.mockResolvedValue(null)

        const res = await request(app)
            .delete('/crypto/btc')
        
        expect(res.status).toBe(404)
        expect(res.body.message).toBe("no Crypto found")
    });
})