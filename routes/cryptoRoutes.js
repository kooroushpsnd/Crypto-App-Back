const express = require("express")
const cryptoController = require("./../controller/cryptoController")
const authController = require("../controller/authController")
const router = express.Router()
const multer = require("multer")

let storage = multer.diskStorage({
    destination: function(req ,file ,cb){
        cb(null ,'./uploads')
    },
    filename: function(req ,file ,cb){
        cb(null ,file.originalname)
    }
})

let upload = multer({storage}).single("image")

router
    .get('/' ,cryptoController.showAll)

router.use(authController.protect ,authController.restrictTo('admin'))

router
    .post('/' ,upload ,cryptoController.create)

router
    .delete('/:name' ,cryptoController.remove)
    
module.exports = router