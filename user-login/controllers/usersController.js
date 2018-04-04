let User = require('../models/user')
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

exports.getRegister = (req, res, next) => {
    res.render('register', {
        currentPage: 'Register',
        errors: '',
        matchedData: ''
    });
};
exports.postRegister = (req, res, next) => {
    let firstName               = req.body.firstName;
    let lastName                = req.body.lastName;
    let username                = req.body.username;
    let email                   = req.body.email;
    let password                = req.body.password;
    let passwordConfirmation    = req.body.passwordConfirmation;

      var errors = validationResult(req);

      if(!errors.isEmpty()) {
          res.render('register', {
            errors: errors.mapped(),
            matchedData: matchedData(req)
          });
      } else {
          User.create({
            firstName:          firstName,
            lastName:           lastName,
            username:           username,
            email:              email,
            password:           password
          }, (err, createdUser) => {
            if(err) {
                let err = new Error('User was not created');
                return next(err);
            }
            req.flash('success', 'You are now registered and may log in');
            res.location('/');
            res.redirect('/');
          });
      }

};

exports.getLogin = (req, res, next) => {
    res.render('login', {
        currentPage: 'Log In'
    });
};

exports.getLogout = (req, res, next) => {
    req.logout();
    req.flash('info', 'You have logged out');
    res.redirect('/users/login');
};