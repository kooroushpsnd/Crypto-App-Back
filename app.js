const express = require('express')
const cryptoController = require("./controller/cryptoController")
const AppError = require('./utils/appError')
const cryptoRouter = require('./routes/cryptoRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

app.use(express.json({limit : '10kb'}))


setInterval(() => {
    cryptoController.refreshData()
}, 60000);

app.use('/crypto' ,cryptoRouter)
app.use('/users' , userRouter)

app.all('*' , (req ,res ,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!` ,404))
})



module.exports = app;