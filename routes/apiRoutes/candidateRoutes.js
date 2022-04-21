const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// the db object is using the query() method.  This method runs the SQL query and executes the callback with resulting rows that match
// err is the error response and rows is the database query response
// the query is wrapped in an Express.js route
router.get("/candidates", (req, res) => {
    // const sql = `SELECT * FROM candidates`;
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            // sending a status code of 500 and placing the error message wit hin a JSON object
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

router.get("/candidate/:id", (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id
                 WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, rows) => {
        if (err) {
            // sending a status code of 400 and placing the error message wit hin a JSON object
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// using the object req.body to populate the candidate's data
// using object destructing to pull the body property out of the request object 
router.post("/candidate", ({ body }, res) => {
    const errors = inputCheck(body, "first_name", "last_name", "industry_connected");
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
            VALUES (?, ?, ?)`;

    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: body
        });
    });
});

//update a candidate's party

router.put("/candidate/:id", (req, res) => {
    // forces any PUT request to the endpoint to include a party_id property
    const errors = inputCheck(req.body, "party_id");
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE candidates SET party_id = ?
                 WHERE id = ?`;
                 // the affected row's id should always be part of the route while the actual fields
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: "Candidate not found"
            });
        } else {
            res.json({
                message: "success",
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

router.delete("/candidate/:id", (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, rows) => {
        if (err) {
            // sending a status code of 400 and placing the error message wit hin a JSON object
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: "Candidate not found"
            });
        } else {
            res.json({
                message: "deleted",
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;