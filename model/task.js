//comment is task
const db = require("../util/database");
const tbUser = "user";
const tbBoard = "board";
const tbColumn = "task";
const tbTask = "comment";

module.exports = {
  all: async () => {
    const sql = `SELECT * FROM ${tbTask} WHERE isDeleted=false`;
    const rows = await db.load(sql);
    return rows;
  },
  byColumnId: async(colmunId) => {
      const sql = `SELECT * from ${tbTask} WHERE taskId=${colmunId} AND isDeleted=false`;
      const rows = await db.load(sql);
      return rows;
  },
};
