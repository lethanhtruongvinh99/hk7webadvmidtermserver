const { create } = require("hbs");
const mysql = require("mysql");

function createConnection() {
  return mysql.createConnection({
    // host: "db4free.net",
    // port: 3306,
    // user: "truongvinh",
    // password: "cf333d3f",
    // database: "hk7webadvmidterm",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "hk7webadvmidterm",
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
        resolve(results.affectedRows);
      }
    });
    con.end();
  });
};
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
