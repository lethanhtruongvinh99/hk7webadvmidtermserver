const express = require("express");
const router = express.Router();
const tbBoard = require("../../model/board");
const tbBoardName = "board";
const db = require("../../util/database");

router.get("/", async (req, res, next) => {
  let boardList = await tbBoard.all();
  res.json(boardList);
  res.end();
});
router.get("/userId=:userId", async (req, res, next) => {
  let userId = req.params.userId;
  let boardList = await tbBoard.byUserId(userId);
  res.json(boardList);
  res.end();
});
router.post("/add", async (req, res) => {
  try {
    let newBoard = {
      userId: req.body.userId,
      boardName: req.body.boardName,
      isCreated: new Date(),
    };
    await db.add(tbBoardName, newBoard);
  } catch (err) {
    console.log(err);
  }
  res.send({ status: 200 });
  res.end();
});
router.get("/delete/boardId=:boardId", async (req, res) => {
  try {
    let delBoard = {
      boardId: req.params.boardId,
      isDeleted: true,
      isUpdated: new Date(),
    };
    console.log(req.params.boardId);
    await db.update(tbBoardName, delBoard, "boardId");
  } catch (err) {
    console.log(err);
  }
  res.send({ status: 200 });
  res.end();
});
router.post("/update", async (req, res) => {
  try {
    let updateBoard = {
      boardId: req.body.boardId,
      boardName: req.body.newBoardName,
      isUpdated: new Date(),
    };
    console.log(req.body.newBoardName);
    await db.update(tbBoardName, updateBoard, "boardId");
  } catch (err) {
    console.log(err);
  }
  res.send({ status: 200 });
  res.end();
});

module.exports = router;
