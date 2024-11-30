const mongoose = require("mongoose")

const cryptoSchema = new mongoose.Schema({
    name: {
        type : String,
        require : [true ,"a Crypto must have a Name"],
        unique : true
    },

    price: {
        type: String,
        require: [true ,"a Crypto must have a Price"]
    },
    image: String
})

const Crypto = mongoose.model("Crypto" ,cryptoSchema)

module.exports = Crypto