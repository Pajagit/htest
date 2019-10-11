const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const User = require("../models/user");
const Project = require("../models/project");
const Role = require("../models/role");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findByPk(jwt_payload.id, {
        include: [
          {
            model: Project,
            attributes: ["id", "title"],
            through: {
              attributes: ["role_id"]
            },
            as: "projects",
            required: false
          }
        ]
      })
        .then(user => {
          if (user) {
            user.projects = jwt_payload.projects;
            user.superadmin = jwt_payload.superadmin;
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(err => console.log(err));
    })
  );
};
