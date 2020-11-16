const { create } = require("hbs");
const mysql = require("mysql");

function createConnection() {
  return mysql.createConnection({
    host: "db4free.net",
    port: 3306,
    user: "truongvinh",
    password: "cf333d3f",
    database: "hk7webadvmidterm",
    // host: "localhost",
    // port: 3306,
    // user: "root",
    // password: "1234",
    // database: "hk7webadvmidterm",
  });
}

module.exports.load = (sql) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    con.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
    con.end();
  });
};

module.exports.add = (tbName, entity) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    let sql = `INSERT INTO ${tbName} SET ?`;
    con.query(sql, entity, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
    con.end();
  });
};
//update board infomation
module.exports.update = (tbName, entity, idField) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    let sql = `UPDATE ${tbName} SET ? WHERE boardId=${idField}`;
    con.query(sql, entity, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.affectedRows);
      }
    });
    con.end();
  });
};
//update user info
module.exports.update2 = (tbName, entity, idField) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    let sql = `UPDATE ${tbName} SET ? WHERE userId=${idField}`;
    con.query(sql, entity, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.affectedRows);
      }
    });
    con.end();
  });
};
//update Column info
module.exports.update3 = (tbName, entity, idField) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    let sql = `UPDATE ${tbName} SET ? WHERE taskId=${idField}`;
    con.query(sql, entity, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
    con.end();
  });
};
//update Comment info
module.exports.update4 = (tbName, entity, idField) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    let sql = `UPDATE ${tbName} SET ? WHERE commentId=${idField}`;
    con.query(sql, entity, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
    con.end();
  });
};
