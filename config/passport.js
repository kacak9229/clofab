var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var config = require('../config/config');
var User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new TwitterStrategy(config.twitter, function(token, refreshToken, profile, done) {

  User.findOne({ twitter: profile.id }, function(err, user) {
    if (err) return done(err);

    if (user) {
      return done(null, user);
    } else {
      var user = new User();
      user.twitter = profile.id;
      user.tokens.push({ kind: 'twitter', token: token });
      user.username = profile.username;
      user.displayName = profile.displayName;
      user.picture = profile._json.profile_image_url_https.replace('_normal', '');

      user.save(function(err) {
        if (err) return done(err);
        user.on('es-indexed', function(err, res){
          /* Document is indexed */
          console.log("Indexed");
          });
          return done(null, user);
      });
    }
  });
}));


exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};
