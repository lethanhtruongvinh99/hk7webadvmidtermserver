const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const db = require("../util/database");
const user = require("../model/user");
const tbUser = "user";

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
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    const userLogin = await user.byAccount(username, password);
    if (userLogin.length === 1) {
      res.json({ status: 200, user: userLogin[0] });
      res.end();
    } else {
      res.json({ status: 204, message: "Failed"});
      res.end();
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
