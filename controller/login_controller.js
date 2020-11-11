const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const db = require("../util/database");
const user = require("../model/user");
const tbUser = "user";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      res.status(401).send({ message: "Sai tên đăng nhập hoặc Mật khẩu!" }).end();
      return;
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
