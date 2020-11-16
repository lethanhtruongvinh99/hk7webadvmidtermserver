const express = require("express");
const router = express.Router();
const tbTask = require("../../model/task");
const jwt = require("jsonwebtoken");
const db = require("../../util/database");
const tbColumnName = "task";
const tbTaskName = "comment";
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const listTask = await tbTask.all();
  res.status(200).send(listTask).end();
});

router.post("/tasks", async (req, res) => {
  try {
    columnId = req.body.columnId;
    let listTaskByColumnId = await tbTask.byColumnId(columnId);
    res.status(200).send(listTaskByColumnId).end();
  } catch (err) {
    res.status(402).send({ message: err }).end();
  }
});

router.post("/add", async (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  if (token === "null") {
    return res.status(401).send({ message: "Bạn chưa đăng nhập" }).end();
  }
  if (token) {
    if (req.body.content.length === 0) {
      return res.status(402).send({ message: "Không được bỏ trống!" }).end();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.data.userId;
    try {
      let newTask = {
        taskId: req.body.columnId,
        userId: userId,
        content: req.body.content,
        isCreated: new Date(),
      };
      const addNewTask = await db.add(tbTaskName, newTask);
      console.log(addNewTask);
      if (addNewTask.affectedRows === 1) {
        res.status(200).send({
          message: "Thêm thành công",
          data: {
            commentId: addNewTask.insertId,
            taskId: newTask.boardId,
            userId: userId,
            content: newTask.content,
            isDeleted: false,
            isCreated: newTask.isCreated,
            isUpdated: null,
          },
        });
      } else {
        res.status(403).send({ message: "Có lỗi xảy ra khi thêm" }).end();
      }
    } catch (err) {
      console.log(err);
      res.status(402).send({ message: err }).end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});

router.post("/update", async (req, res) => {
  const token = req.headers.authorization;
  console.log(req.body);
  if (token === "null") {
    return res.status(401).send({ message: "Bạn chưa đăng nhập" }).end();
  }
  if (token) {
    if (req.body.newTaskName.length === 0) {
      return res.status(402).send({ message: "Không được để trống" }).end();
    }
    try {
      let updateTask = {
        commentId: req.body.taskId,
        content: req.body.newTaskName,
        isUpdated: new Date(),
      };
      const updateStatus = await db.update4(
        tbTaskName,
        updateTask,
        updateTask.commentId
      );
      if (updateStatus.affectedRows === 1) {
        res.status(200).send({ message: "Sửa thành công" }).end();
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: err }).end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});
router.post("/delete", async (req, res) => {
  const token = req.headers.authorization;
  if (token === "null") {
    return res.status(401).send({ message: "Bạn chưa đăng nhập" }).end();
  }
  if (token) {
    try {
      let deleteTask = {
        commentId: req.body.taskId,
        isDeleted: true,
        isUpdated: new Date(),
      };
      const deleteTaskStatus = await db.update4(
        tbTaskName,
        deleteTask,
        deleteTask.commentId
      );
      if (deleteTaskStatus.affectedRows === 1) {
        res.status(200).send({ message: "Xóa thành công" }).end();
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: err }).end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});
module.exports = router;
