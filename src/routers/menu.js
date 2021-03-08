const express = require('express')
const menuController = require('../controllers/menu')
const { authentication, authorization } = require('../helpers/auth')

const router = express.Router()

router.get('/', menuController.getAll)
router.get('/:id', authentication, menuController.getById)
router.post('/', authentication, authorization, menuController.create)
router.patch('/:id', authentication, authorization, menuController.update)
router.delete('/:id', authentication, authorization, menuController.delete)

module.exports = router