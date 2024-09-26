const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.getAllUsers = catchAsync(async(req ,res ,next) => {
    const users = await User.find()

    res.status(200).json({
        status: "success",
        users
    })
})

exports.craeteUser = catchAsync()

exports.deleteUser = catchAsync(async(req ,res ,next) => {
    await User.findByIdAndDelete(req.params.id)

    res.status(204).json({
        status: "success",
        data: null
    })
})

exports.updateUser = catchAsync(async(req ,res ,next) => {
    const user = await User.findByIdAndUpdate(req.params.id ,req.body ,{
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})

exports.deleteUser