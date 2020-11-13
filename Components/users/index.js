const express = require("express");
const router = express.Router();
const tbUser = require("../../model/user");
const jwt = require("jsonwebtoken");
const db = require("../../util/database");
const tbUserName = "user";
const bcrypt = require("bcrypt");

router.get("/", async (req, res, next) => {
  let userList = await tbUser.all();
  res.json(userList);
  res.end();
});
router.get("/profile", async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.data.userId;
    const username = decoded.data.username;
    let users = await tbUser.byUserId(userId);
    const user = users[0];
    if (!user) {
      res.status(401).send({ message: "Lỗi xác thực" }).end();
    } else {
      res
        .status(200)
        .send({
          userId: userId,
          username: username,
          fullname: user.fullName,
          createdDate: user.isCreated,
        })
        .end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});
router.post("/update", async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.data.userId;
    const updateUser = {
      userId: userId,
      fullName: req.body.fullname,
      isUpdated: new Date(),
    };
    const updateRows = await db.update2(
      tbUserName,
      updateUser,
      updateUser.userId
    );
    if (updateRows === 1) {
      res.status(200).send({ message: "Cập nhật thành công!" }).end();
    } else {
      res.status(401).send({ message: "Lỗi xác thực" }).end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});
router.post("/changepassword", async (req, res) => {
  const token = req.headers.authorization;
  if (req.body.password !== req.body.confPassword) {
    res.status(402).send({ message: "Mật khẩu chưa khớp" }).end();
  }
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.data.userId;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updateUser = {
      userId: userId,
      password: hashedPassword,
      isUpdated: new Date(),
    };
    const updateRows = await db.update2(
      tbUserName,
      updateUser,
      updateUser.userId
    );
    if (updateRows === 1) {
      res.status(200).send({ message: "Đổi mật khẩu thành công!" }).end();
    } else {
      res.status(401).send({ message: "Lỗi xác thực" }).end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});

module.exports = router;
