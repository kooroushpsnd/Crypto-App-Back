const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        require : [true ,"a User must have a Name"]
    },
    email: {
        type: String,
        require: [true ,"a User must have a Price"],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail ,"Please provide a valid Email"]
    },
    password: {
        type: String,
        require: [true ,"Please provide a Password"],
        minlength:8
    },
    passwordConfirm: {
        type: String,
        require: [true ,"Please confirm your password"],
        validate: {
            validator: function(el){
                return el === this.password
            },
            message: "password is not the same"
        }
    }
})

userSchema.pre('save' ,async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password ,12)
    this.passwordConfirm = undefined
    next()
})

const User = mongoose.model("User" ,userSchema)

module.exports = User