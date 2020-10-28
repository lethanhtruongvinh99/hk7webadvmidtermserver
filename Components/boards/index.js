const express = require('express');
const router = express.Router();
const tbBoard = require('../../model/board');

router.get('/', async (req, res, next) => {
    let boardList = await tbBoard.all();
    res.json(boardList);
});

module.exports = router;