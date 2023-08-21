// Passport là một thư viện quản lý xác thực cho các ứng dụng Node.js
var passport = require("passport");

var LocalStrategy = require("passport-local");
var UserModel = require("../models/UserModel");

// Cấu hình local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        var user = await UserModel.findOne({email});
        // Email does NOT exist
        if (!user) {
          return done(null, false, {
            message: "Username/Email not registered!",
          });
        }
        // Email exist and now we need to verify passsword
        var isMatch = await user.isValidPassword(password);
        return isMatch
          ? done(null, user)
          : done(null, false, { message: "Incorrect password!" });
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serialize người dùng để lưu vào session
passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, {
      id: user.id,
      email: user.email,
      role: user.role
    });
  });
});
  
// Deserialize người dùng từ session
passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user);
  });
});
