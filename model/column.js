const db = require('../util/database');
const tbUser = 'user';
const tbBoard = 'board';
const tbColumn = 'task';
const tbComment = 'comment';

module.exports = {
    all: async () => {
        const sql = `SELECT * from ${tbColumn} WHERE isDeleted=false`;
        const rows = await db.load(sql);
        return rows;
    },
    byBoardId: async (BoardId) => {
        const sql = `SELECT * from ${tbColumn} WHERE boardId=${BoardId} AND isDeleted=false`;
        const rows = await db.load(sql);
        return rows;
    },
}
