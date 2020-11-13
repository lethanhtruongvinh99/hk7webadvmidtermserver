const express = require("express");
// const { authCheck } = require("../../middleware/authCheck");
const router = express.Router();
const tbColumn = require("../../model/column");
const tbColumnName = "task";
const db = require("../../util/database");
const jwt = require("jsonwebtoken");

router.get("/allColumns", async (req, res) => {
  let columnList = await tbColumn.all();
  res.send(columnList).end();
});
//add new column as well as task
router.post("/add", async (req, res) => {
  const token = req.headers.authorization;
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
module.exports = router;
