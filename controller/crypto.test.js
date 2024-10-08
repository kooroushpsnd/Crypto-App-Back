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


const axios = require("axios")
const request = require('supertest')
const app = require('../app')
const Crypto =require('../models/cryptoModel')

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
        const cryptoData = {USD: 4000}

        axios.get.mockResolvedValue({data: cryptoData})

        Crypto.create = jest.fn().mockResolvedValue({
            name: 'BTC',
            price: Math.floor(cryptoData.USD * 60000),
        });

        const response = await request(app)
                .post('/crypto')
                .send({ name: 'btc' })
                .expect(201)

        expect(response.body.status).toBe('success');
        expect(response.body.crypto).toHaveProperty('name', 'BTC');
        expect(response.body.crypto).toHaveProperty('price', Math.floor(cryptoData.USD * 60000));
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
            price: 60000
        })

        const res = await request(app)
            .delete('/crypto/btc')
        
        expect(res.status).toBe(204)
    });

    it('should return no Crypto found with 404', async() => {
        Crypto.findOne.mockResolvedValue(null)

        const res = await request(app)
            .delete('/crypto/btc')
        
        expect(res.status).toBe(404)
        expect(res.body.message).toBe("no Crypto found")
    });
})