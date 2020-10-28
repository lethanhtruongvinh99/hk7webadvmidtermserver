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
    }
}