const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root@2026",
    database: "attendence_db"
});

module.exports = db;