const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "attendence_db"
});

module.exports = db;