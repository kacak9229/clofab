var router = require('express').Router();
var passport = require('passport');
var passportConf = require('../config/passport');

var User = require('../models/user');

router.get('/login/twitter', passport.authenticate('twitter'));

router.get('/login/twitter/return', passport.authenticate('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

router.get('/profile', passportConf.isAuthenticated, function(req, res, next) {
  res.render('accounts/profile');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/usersList', function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) return next(err);
    res.render('accounts/users', { users: users, message: req.flash('error')});
  });
});

/* Strictly for admin */
router.get('/create-admin', function(req, res, next) {

  var user = new User();
  user.username = "DragonKing";
  user.displayName = "The Dragon Doctor";
  user.picture = "https://s-media-cache-ak0.pinimg.com/236x/94/30/e0/9430e00507a306d80b35720750f98c10.jpg";
  user.password = "dragonQueen";

  user.save(function(err) {
    req.logIn(user, function(err) {
      if (err) return next(err);

      res.redirect('/profile');
    });
  });
});



router.post('/deleteUser', function(req, res, next) {
  console.log(req.user._id);

  if (String(req.user._id) === '56a4d5f6ec351f0c9dcb8ada') {

    User.remove({ _id: req.body.userId }, function(err) {

      if (err) return next(err);

      return res.redirect('/usersList');
    });
  } else {
    res.json("Not a chance");
  }
});

module.exports = router;
