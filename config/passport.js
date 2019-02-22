const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = (req) => {
  return req.headers.authorisation
}
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          console.log("passport searched for user:", user);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log("error finding user: ", err));
    })
  );
};
