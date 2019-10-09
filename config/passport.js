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
            if (user.projects.length > 0) {
              var projectUsers = [];
              var projectsProcessed = 0;
              user.projects.forEach(project => {
                var projectUser = {};
                Role.findOne({
                  attributes: ["title"],
                  where: {
                    id: project.userroleprojects.role_id
                  }
                }).then(role => {
                  if (role) {
                    projectUser.role = role.title;
                    projectUser.id = project.id;
                    projectUsers.push(projectUser);
                    projectsProcessed++;
                    if (projectsProcessed === user.projects.length) {
                      user.projects = projectUsers;
                      return done(null, user);
                    }
                  }
                });
              });
            } else {
              user.projects = [];
              return done(null, user);
            }
          } else {
            return done(null, false);
          }
        })
        .catch(err => console.log(err));
    })
  );
};
