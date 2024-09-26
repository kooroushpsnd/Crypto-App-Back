const express = require('express')
const cryptoController = require("./controller/cryptoController")
const AppError = require('./utils/appError')
const cryptoRoute = require('./routes/cryptoRoutes')

const app = express()

app.use(express.json({limit : '10kb'}))


setInterval(() => {
    cryptoController.refreshData()
}, 60000);

app.use('/crypto' ,cryptoRoute)

app.all('*' , (req ,res ,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!` ,404))
})



module.exports = app;