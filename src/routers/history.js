const express = require('express')
const historyController = require('../controllers/history')
const { authentication, authorization } = require('../helpers/auth')

const router = express.Router()

router.get('/', historyController.getAll)
router.get('/:id', authentication, historyController.getById)
router.post('/', authentication, historyController.create)
router.patch('/:id', authentication, authorization, historyController.update)
router.delete('/:id', authentication, authorization, historyController.delete)

module.exports = router