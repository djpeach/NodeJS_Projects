var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { 
          console.log('Error finding user');
          return done(err); 
        }
        if (!user) {
          return done(null, false, { message: 'That username is not found' });
        }

        user.comparePassword(password, function(err, isMatch) {
          if(err) { 
            return done(err) 
          }
          if(!isMatch) {
            return done(null, false, {message: 'That password was incorrect for that user'});
          }
          return done(null, user);
        })
      });
    }
  ));

module.exports.login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
});