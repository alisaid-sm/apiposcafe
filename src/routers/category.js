const express = require('express')
const categoryController = require('../controllers/category')
const { authentication, authorization } = require('../helpers/auth')

const router = express.Router()

router.get('/', categoryController.getAll)
router.get('/:id', authentication, categoryController.getById)
router.post('/',authentication, authorization, categoryController.create)
router.patch('/:id', authentication, authorization, categoryController.update)
router.delete('/:id', authentication, authorization, categoryController.delete)

module.exports = router