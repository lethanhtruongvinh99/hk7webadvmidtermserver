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
  res.send("Signup");
});
router.post("/", (req, res) => {
  try {
    console.log(req.body.username + "/" + new Date() + " Signup");
    // newUser = {
    //     username: "username1",
    //     password: "123456",
    //     isCreated: new Date(),
    // }
    // await db.add(tbUser, newUser);
  } catch (err) {
    console.log(err);
  }
  res.send("OK");
});
module.exports = router;
