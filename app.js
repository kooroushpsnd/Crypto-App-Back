const express = require('express')
const cryptoController = require("./controller/cryptoController")
const AppError = require('./utils/appError')
const cryptoRouter = require('./routes/cryptoRoutes')
const userRouter = require('./routes/userRoutes')
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const XSS = require("xss-clean")
const HPP = require("hpp")
const bodyparser = require("body-parser")
const cors = require('cors')
const { bot } = require('./controller/bot')

const app = express()

app.use(cors())
app.options('*' ,cors())

app.use(helmet())
app.use(express.json({limit : '10kb'}))

app.use(mongoSanitize())
app.use(XSS())
app.use(HPP())

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

// setInterval(() => {
//     cryptoController.refreshData()
// }, 60000);

app.use('/crypto' ,cryptoRouter)
app.use('/users' , userRouter)

app.all('*' , (req ,res ,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!` ,404))
})



module.exports = app;