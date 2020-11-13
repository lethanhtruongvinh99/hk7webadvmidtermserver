const db = require('../util/database');
const tbUser = 'user';
const tbBoard = 'board';
const tbTask = 'task';
const tbComment = 'comment';

module.exports = {
    //Load all accounts
    all: async () => {
        const sql = `SELECT * from ${tbUser}`;
        const rows = await db.load(sql);
        return rows;
    },
    //Login
    byAccount: async (username, password) => {
        const sql = `SELECT * from ${tbUser} WHERE username="${username}" AND password="${password}"`;
        const rows = await db.load(sql);
        return rows;
    },
    checkExistedUsername: async (username) => {
        const sql = `SELECT * from ${tbUser} WHERE username="${username}"`;
        const rows = await db.load(sql);
        return rows;
    },
    byUserId: async (userId) => {
        const sql = `SELECT * from ${tbUser} WHERE userId=${userId} AND isDeleted=false`;
        const rows = await db.load(sql);
        return rows;
    }
}