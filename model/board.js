const db = require('../util/database');
const tbUser = 'user';
const tbBoard = 'board';
const tbTask = 'task';
const tbComment = 'comment';

module.exports = {
    all: async () => {
        const sql = `SELECT * from ${tbBoard}`;
        const rows = await db.load(sql);
        return rows;
    },
    byUserId: async(userId) => {
        const sql = `SELECT * from ${tbBoard} WHERE userID="${userId}" AND isDeleted=false`;
        const rows = await db.load(sql);
        return rows;
    } ,
    byBoardId: async(boardId) => {
        const sql = `SELECT * from ${tbBoard} WHERE boardId="${boardId}"`;
        const rows = await db.loads(sql);
        return rows;
    },
}