const express = require('express')
const userController = require('../controllers/user')
const { authentication, authorization } = require('../helpers/auth')

const router = express.Router()

router.get('/',authentication, authorization, userController.getAll)
router.get('/:id',authentication, userController.getById)
router.post('/signup', userController.signup)
router.get('/activation/:token', userController.activation, express.static('public'))
router.post('/signin', userController.signin)
router.post('/reftoken',authentication, userController.reftoken)
router.post('/roleup/:id',authentication, authorization, userController.roleup)
router.post('/roledown/:id',authentication, authorization, userController.roledown)
router.post('/chgusername/:id',authentication, userController.chgusername)
router.delete('/:id',authentication, authorization, userController.delete)

module.exports = router