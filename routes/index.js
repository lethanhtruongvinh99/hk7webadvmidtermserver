var express = require('express');
var router = express.Router();
const user = require('../model/user');
const db = require('../util/database');
const mysql = require('mysql');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
