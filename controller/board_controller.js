const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const db = require("../util/database");
const board = require("../model/board");
const tbBoard = "board";

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

