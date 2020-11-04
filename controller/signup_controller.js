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
router.get("/", async (req, res) => {
  res.send({ message: "Sign up" });
});
router.post("/", async (req, res) => {
  try {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      isCreated: new Date(),
    };
    const findUsername = await user.checkExistedUsername(newUser.username);
    if (findUsername.length === 1) {
      console.log(findUsername.length);
      res.json({ status: 201 });
      res.end();
    } else {
      await db.add(tbUser, newUser);
      res.json({ status: 200 });
      res.end();
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
