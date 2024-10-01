const express = require("express")
const cryptoController = require("./../controller/cryptoController")
const authController = require("../controller/authController")

const router = express.Router()
router.use(authController.protect ,authController.restrictTo('admin'))

router
    .route('/')
    .get(cryptoController.showAll)
    .post(cryptoController.create)

router
    .delete('/:name' ,cryptoController.remove)
    
module.exports = router