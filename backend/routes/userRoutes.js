const express = require('express')
const router = express.Router()

const {signUp, login , getUsers} = require('../controllers/userController')

router.get('/', getUsers)
router.post('/signup',signUp)
router.post('/login' , login)

module.exports = router