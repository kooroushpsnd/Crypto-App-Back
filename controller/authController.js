const catchAsync = require("../utils/catchAsync")
const AppError = require('../utils/appError')
const User = require("../models/userModel")

exports.signup = catchAsync(async(req ,res ,next) => {
    const newUser = await User.create(req.body)

    res.status(201).json({
        status:"success",
        data: {
            user: newUser
        }
    })
})