const express = require("express");
// const { authCheck } = require("../../middleware/authCheck");
const router = express.Router();
const tbBoard = require("../../model/board");
const tbBoardName = "board";
const db = require("../../util/database");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.data.userId;
    // const username = decoded.data.username;
    let boardList = await tbBoard.byUserId(userId);
    return res.status(200).json(boardList).end();
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});

router.get("/allBoards", async (req, res, next) => {
  let boardList = await tbBoard.all();
  res.json(boardList);
  res.end();
});
router.post("/add", async (req, res) => {
  const token = req.headers.authorization;
  if (token === "null"){
    return res.status(401).send({ message: "Bạn chưa đăng nhập" }).end();
  }
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.data.userId;
    try {
      let newBoard = {
        userId: userId,
        boardName: req.body.boardName,
        isCreated: new Date(),
      };
      const addNew = await db.add(tbBoardName, newBoard);
      console.log(addNew);
      if (addNew.affectedRows === 1) {
        res.status(200).send({
          message: "Thêm thành công",
          data: {
            boardId: addNew.insertId,
            userId: userId,
            boardName: req.body.boardName,
            isCreated: newBoard.isCreated,
            isDeleted: false,
            isUpdated: null,
          },
        });
      } else {
        res.status(403).send({ message: "Có lỗi xảy ra khi thêm" });
      }
    } catch (err) {
      res.status(402).send({ message: err }).end();
    }
  } else {
    res.status(401).send({ message: "Lỗi xác thực" }).end();
  }
});
router.get("/boardId=:BoarId", async (req, res) => {
  const boardId = req.params.BoarId;
  console.log(boardId);
  const getByBoardId = await tbBoard.byBoardId(boardId);
  if (getByBoardId[0]) {
    res.status(200).send(getByBoardId[0]).end();
  } else {
  }
});
router.post("/delete", async (req, res) => {
  const token = req.headers.authorization;
  if (token === "null"){
    return res.status(401).send({ message: "Bạn chưa đăng nhập" }).end();
  }
  if (token) {
    try {
      let delBoard = {
        boardId: req.body.boardId,
        isDeleted: true,
        isUpdated: new Date(),
      };
      const delBoardStatus = await db.update(
        tbBoardName,
        delBoard,
        delBoard.boardId
      );
      if (delBoardStatus === 1) {
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
router.post("/update", async (req, res) => {
  const token = req.headers.authorization;
  if (token === "null"){
    return res.status(401).send({ message: "Bạn chưa đăng nhập" }).end();
  }
  if (token) {
    if (req.body.newBoardName.length === 0) {
      return res.status(402).send({ message: "Không được để trống" }).end();
    }
    try {
      let updateBoard = {
        boardId: req.body.boardId,
        boardName: req.body.newBoardName,
        isUpdated: new Date(),
      };
      const updateStatus = await db.update(
        tbBoardName,
        updateBoard,
        updateBoard.boardId
      );
      if (updateStatus === 1) {
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

module.exports = router;
