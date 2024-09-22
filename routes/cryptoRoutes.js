const express = require("express")
const cryptoController = require("./../controller/cryptoController")

const router = express.Router()

router.post('/create' ,cryptoController.create)
router.get('/' ,cryptoController.showAll)
router.delete('/:name' ,cryptoController.remove)

module.exports = router