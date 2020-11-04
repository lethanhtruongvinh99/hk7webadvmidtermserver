const express = require('express');
const router = express.Router();
const tbUser = require('../../model/user');

router.get('/', async (req, res, next) => {
    let userList = await tbUser.all();
    res.json(userList);
    res.end();
});

module.exports = router;