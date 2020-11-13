const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const db = require("../util/database");
const user = require("../model/user");
const tbUser = "user";
const bcrypt = require("bcrypt");

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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      username: req.body.username,
      password: hashedPassword,
      isCreated: new Date(),
    };
    const findUsername = await user.checkExistedUsername(newUser.username);
    if (findUsername.length !== 0) {
      console.log(findUsername.length + " Ton Tai Username: " + req.body.username);
      res.status(400).send({message: "Tên tài khoản đã tồn tại!"});
      res.end();
    } else {
      await db.add(tbUser, newUser);
      res.status(200).send({message: "Tạo tài khoản thành công"});
      res.end();
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
