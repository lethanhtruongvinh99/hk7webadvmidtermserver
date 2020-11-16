const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStategy = require("passport-facebook");
const tbUser = require("../model/user");
const db = require("../util/database");
const tbUserName = "user";
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "960778196185-egg4qbc8uerf74n096c376vesj6q4ao3.apps.googleusercontent.com",
      clientSecret: "c3mAn3hBaaqdJMa-8B0Nhjpa",
      callbackURL: "/login/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("passport callback func fired");
      const findUser = await tbUser.checkExistedUsername(
        profile.emails[0].value
      );
      let userSend;
      if (findUser.length === 0) {
        let newUser = {
          username: profile.emails[0].value,
          fullName: profile.displayName,
          isCreated: new Date(),
        };
        const addNewAccount = await db.add(tbUserName, newUser);
        if (addNewAccount.affectedRows === 1) {
          userSend = {
            userId: addNewAccount.insertId,
            username: newUser.username,
          };
          done(null, userSend, {
            message: "Create new account for first sign in",
          });
        }
      } else {
        userSend = {
          userId: findUser[0].userId,
          username: findUser[0].userName,
        };
        done(null, userSend, { message: "Re-sign in" });
      }
    }
  )
);

passport.use(
  new FacebookStategy(
    {
      clientID: "362948448335513",
      clientSecret: "4b40a638790bb1a450a9cf5459a5eaf9",
      callbackURL: "/login/facebook/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      const findUser = await tbUser.checkExistedUsername(profile.id);
      let userSend;
      if (findUser.length === 0) {
        let newUser = {
          username: profile.id,
          fullName: profile.displayName,
          isCreated: new Date(),
        };
        const addNewAccount = await db.add(tbUserName, newUser);
        if (addNewAccount.affectedRows === 1) {
          userSend = {
            userId: addNewAccount.insertId,
            username: newUser.username,
          };
          done(null, userSend, {
            message: "Create new account for first sign in",
          });
        }
      } else {
        userSend = {
          userId: findUser[0].userId,
          username: findUser[0].userName,
        };
        done(null, userSend, { message: "Re-sign in" });
      }
    }
  )
);
