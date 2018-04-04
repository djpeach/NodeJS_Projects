const { check, validationResult } = require('express-validator/check');
const User = require('../models/user');


exports.validateUserRegistration = [
    check('firstName').isLength({min:1}).trim().withMessage('The First Name field must be filled in'),
    check('lastName').isLength({min:1}).trim().withMessage('The Last Name field must be filled in'),
    check('username').isLength({min:1}).trim().withMessage('The User Name field must be filled in'),
    check('username').custom(value => {
        return User.findUserByUsername(value).then(user => {
            if(user) { throw new Error('There already exists a user with this username')}
        })
    }),
    check('email').isLength({min:1}).trim().withMessage('The Email field must be filled in'),
    check('email').isEmail().trim().normalizeEmail().withMessage('The Email field must contain a valid email'),
    check('email').custom(value => {
        return User.findUserByEmail(value).then(user => {
            if(user) { throw new Error('There already exists a user with this email'); }
        })
    }),
    check('password').isLength({min:1}).trim().withMessage('The Password field must be filled in'),
    check('password').isLength({min:6}).trim().withMessage('The Password must be at least 6 characters'),
    check('passwordConfirmation').isLength({min:1}).trim().withMessage('The Password Confirmation field must be filled in'),
    check('passwordConfirmation', 'First password field must be filled in before confirmation password').custom((value, {req}) => {
        return req.body.password.trim() != ''
    }),
    check('passwordConfirmation', 'Passwords do not match').custom((value, {req}) => {
        return value === req.body.password;
    }),
]

