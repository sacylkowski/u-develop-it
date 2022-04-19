const mysql = require("mysql2");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        // your SQL username,
        user: "root",

        // your SQL password
        password: "Bananabread27",

        database: "election"
    },
    console.log("Connected to the election database.")
);

// the db object is using the query() method.  This method runs the SQL query and executes the callback with resulting rows that match
// err is the error response and rows is the database query response
db.query(`SELECT * FROM candidates`, (err, rows) => {
    // console.log(rows);
});

db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    // if (err) {
    //     console.log(err);
    // }
    // console.log(row);
});

db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
    // if (err) {
    //     console.log(err);
    // }
    // console.log(result);
});

const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
VALUES (?, ?, ?, ?)`;

const params = [1, "Ronald", "Firbank", 1];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});


// default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});