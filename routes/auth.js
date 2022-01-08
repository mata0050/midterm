/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

module.exports = (db) => {
  // Create a new user
  router.post("/", (req, res) => {
    const user = req.body;

    // console.log(user);
    res.json(user);
    // db.query(`SELECT * FROM food;`)
    //   .then((data) => {
    //     const users = data.rows;
    //     res.json({ users });
    //   })
    //   .catch((err) => {
    //     res.status(500).json({ error: err.message });
    //   });
  });
  return router;
};
