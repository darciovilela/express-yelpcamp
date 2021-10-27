const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');

//Rota para ver o form de registro de user
router.get('/register', users.userRegisterForm);

//Rota para submit do form de registro
router.post('/register', catchAsync(users.userRegistered));

//Rota para form de login
router.get('/login', users.userLoginForm);

//Rota para submit form de login
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  users.userLogged
);

//Rota para logout
router.get('/logout', users.userLogout);

module.exports = router;
