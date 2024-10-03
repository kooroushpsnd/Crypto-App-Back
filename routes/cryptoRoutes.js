const express = require("express")
const cryptoController = require("./../controller/cryptoController")
const authController = require("../controller/authController")

const router = express.Router()

router
    .get('/' ,cryptoController.showAll)

router.use(authController.protect ,authController.restrictTo('admin'))

router
    .post('/' ,cryptoController.create)

router
    .delete('/:name' ,cryptoController.remove)
    
module.exports = router