const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fs = require("fs");
const path = require("path");
const userService = require("../services/users");

// const keyPath = path.join(__dirname, "..", "pub_key.pem");
// const PUB_KEY = fs.readFileSync(keyPath, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PUB_KEY,
  algorithms: ["RS256"],
};

module.exports = (passport) => {
  // The JWT payload is passed into the verify callback

  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await userService.findUserById(jwt_payload.sub);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
