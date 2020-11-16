const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const db = require("../util/database");
const user = require("../model/user");
const tbUser = "user";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { route } = require("../routes");

let tempUser;
const localhost3000 = "http://localhost:3000";
const localhost3000 = "http://localhost:3001";


router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Login");
  res.end();
});

router.get("/authCheck", async (req, res) => {
  res.send("Check Token is Expire").end();
});

router.post("/", async (req, res) => {
  try {
    const secret = process.env.JWT_SECRET;
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    const users = await user.checkExistedUsername(username);
    const loginUser = users[0];
    if (!loginUser) {
      res.status(401).send({ message: "Sai tên đăng nhập hoặc Mật khẩu!" });
      res.end();
      return;
    }
    const compareRes = await bcrypt.compare(password, loginUser.password);
    if (compareRes) {
      const token = jwt.sign(
        {
          data: {
            username,
            userId: loginUser.userId,
          },
        },
        secret
      );
      res.status(200).send({ accessToken: token }).end();
    } else {
      res
        .status(401)
        .send({ message: "Sai tên đăng nhập hoặc Mật khẩu!" })
        .end();
      return;
    }
  } catch (err) {
    console.log(err);
  }
});
//google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // console.log(req.user);
  tempUser = req.user;
  if (tempUser) res.redirect(localhost3000 + "/checkauth");
});
router.get("/google/success", (req, res) => {
  const secret = process.env.JWT_SECRET;
  const accessToken = jwt.sign(
    {
      data: {
        userId: tempUser.userId,
        username: tempUser.username,
      },
    },
    secret
  );
  res.status(200).send({ accessToken: accessToken }).end();
});

//facebook
router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/redirect", passport.authenticate("facebook"), (req, res) => {
  // console.log(req.user);
  tempUser = req.user;
  if (tempUser) res.redirect(localhost3000 + "/checkauth");
});


module.exports = router;
