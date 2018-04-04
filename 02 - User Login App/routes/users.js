const express = require('express');
const router = express.Router();

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

const path = require('path'); // path package for specifying static paths

const userValidator = require('../validators/userValidation');
const usersController = require('../controllers/usersController');
const userAuthenticator = require('../authenticators/userAuthenticators');

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.get('/register', usersController.getRegister);
router.post('/register', userValidator.validateUserRegistration, usersController.postRegister);

router.get('/login', usersController.getLogin);
router.post('/login', userAuthenticator.login);

router.get('/logout', usersController.getLogout);

module.exports = router;
