var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { 
    currentPage: 'Members'
  });
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  req.flash('warning', 'You must be logged in to view the Members Area. Please log in.')
  res.redirect('/users/login')
}

module.exports = router;
