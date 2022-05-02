const express = require('express');
const router = express.Router();
require('dotenv').config()

const authCtrl = require('../controller/auth');
//routes for auth purposes
router.post('/signup',authCtrl.signup);
router.post('/signin',authCtrl.signin);
module.exports = router;