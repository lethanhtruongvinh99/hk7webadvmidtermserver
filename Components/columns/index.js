const express = require("express");
// const { authCheck } = require("../../middleware/authCheck");
const router = express.Router();
const tbColumn = require("../../model/column");
const tbColumnName = "task";
const tbTask = require("../../model/task");
const tbTaskName = "comment";
const db = require("../../util/database");
const jwt = require("jsonwebtoken");

router.get("/allColumns", async (req, res) => {
  let columnList = await tbColumn.all();
  res.send(columnList).end();
});
//add new column as well as task
router.post("/add", async (req, res) => {
  const token = req.headers.authorization;
  if (token === "null") {
    return res.status(401).send({ message: "Bạn chưa đăng nhập" }).end();
  }
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.data.userId;
    try {
      let newColumn = {
        boardId: req.body.boardId,
        userId: userId,
        taskName: req.body.taskName,
        isCreated: new Date(),
      };
      const addNewColumn = await db.add(tbColumnName, newColumn);
      console.log(addNewColumn);
      if (addNewColumn.affectedRows === 1) {
        res.status(200).send({
          message: "Thêm thành công",
          data: {
            taskId: addNewColumn.insertId,
            boardId: newColumn.boardId,
            userId: userId,
            taskName: newColumn.taskName,
            isDeleted: false,
            isCreated: newColumn.isCreated,
            isUpdated: null,
          },
        });
      } else {
        res.status(403).send({ message: "Có lỗi xảy ra khi thêm" }).end();
      }
    } catch (err) {
      res.status(402).send({ message: "Lỗi xác thực" }).end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});
router.post("/columns", async (req, res) => {
  const boardId = req.body.boardId;
  const columns = await tbColumn.byBoardId(boardId);
  res.status(200).send(columns).end();
});
router.post("/update", async (req, res) => {
  const token = req.headers.authorization;
  if (token === "null") {
    return res.status(401).send({ message: "Bạn chưa đăng nhập" }).end();
  }
  if (token) {
    if (req.body.newcolumnName.length === 0) {
      return res.status(402).send({ message: "Không được để trống" }).end();
    }
    try {
      let updateColumn = {
        taskId: req.body.taskId,
        taskName: req.body.newcolumnName,
        isUpdated: new Date(),
      };
      const updateStatus = await db.update3(
        tbColumnName,
        updateColumn,
        updateColumn.taskId
      );
      if (updateStatus.affectedRows === 1) {
        res.status(200).send({ message: "Sửa thành công" }).end();
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: "Có lỗi xảy ra" }).end();
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
  //delete all comment => delete column
  if (token) {
    try {
      const listTask = await tbTask.byColumnId(req.body.taskId);
      const updateDate = new Date();
      for (let i = 0; i < listTask.length; i++) {
        listTask[i].isDeleted = true;
        listTask[i].isUpdated = updateDate;
        await db.update4(tbTaskName, listTask[i], listTask[i].commentId);
      }
      let deleteColumn = {
        taskId: req.body.taskId,
        isUpdated: new Date(),
        isDeleted: true,
      };
      const updateStatus = await db.update3(
        tbColumnName,
        deleteColumn,
        deleteColumn.taskId
      );
      if (updateStatus.affectedRows === 1) {
        res.status(200).send({ message: "Xóa thành công" }).end();
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: "Có lỗi xảy ra" }).end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});
module.exports = router;
