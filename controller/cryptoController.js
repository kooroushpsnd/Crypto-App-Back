const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const Crypto = require("../models/cryptoModel")
const fs = require("fs")
const { default: axios } = require('axios')


exports.create = catchAsync(async(req ,res ,next) => {
    if(await Crypto.findOne({name: req.body.name.toUpperCase()})) return next(new AppError("the crypto already exist" ,400))
    const result = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${req.body.name.toUpperCase()}&tsyms=USD&api_key=${process.env.API_KEY}`)
    const resultTooman = await axios.get(`https://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency.json`)
    if(result.data.Response != 'Error'){
        let price = Math.floor(result.data.USD * Number(resultTooman.data.currency[0].price))
        const image = req.file ? req.file.filename : null;
        const crypto = await Crypto.create({name: req.body.name.toUpperCase() ,price ,image})

        res.status(201).json({
            status: "success",
            crypto : crypto
        })
    }else{
        return next(new AppError("wrong Crypto Name or Price" ,404))
    }
})

exports.remove = catchAsync(async(req ,res ,next) => {
    const result = await Crypto.findOne({name: req.params.name.toUpperCase()})
    if(result){
        const crypto = await Crypto.deleteOne({name: req.params.name.toUpperCase()})
        fs.unlinkSync(`./uploads/${result.image}`)
        res.status(204).json({
            status: "success",
            crypto : crypto
        })
    }else{
        return next(new AppError("no Crypto found" ,404))
    }
})

exports.showAll = catchAsync(async(req ,res ,next) => {
    let crypto = await Crypto.find()
    if (crypto.length == 0) crypto = "no data to show"
    res.status(200).json({
        status: "success",
        crypto
    })
})

exports.refreshData = catchAsync(async(req ,res ,next) => {
    let crypto = await Crypto.find()
    let list_name = []
    if(crypto.length > 0){
        for (let i = 0 ;i < crypto.length ;i++){
            list_name.push(crypto[i].name)
            const result = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${list_name[i]}&tsyms=USD&api_key=${process.env.API_KEY}`)
            const resultTooman = await axios.get(`https://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency.json`)
            let price = Math.floor(result.data.USD * Number(resultTooman.data.currency[0].price))
            if (isNaN(price)) return next(new AppError('error while updating' ,400))
            await Crypto.findOneAndUpdate({name : list_name[i]} ,{$set : {price}} ,{new : true})
        }
    }
})