var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;passport.serializeUser(function(user, done) {
 done(null, user);
});passport.deserializeUser(function(user, done) {
 done(null, user);
});passport.use(
 new GoogleStrategy(
  {
   clientID: "19117053252-nqhee0c2nmovdumnub6tee623hdgkfoo.apps.googleusercontent.com",
   clientSecret: "pZ3QT6ATbGT5DFMQVi_m-hjM",
   callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   var userData = {
    email: profile.emails[0].value,
    name: profile.displayName,
    token: accessToken
   };
   done(null, userData);
  }
 )
);