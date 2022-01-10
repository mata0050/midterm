const express = require("express");
const { checkCurrentUser } = require("../helpers/checkCurrentUser");
const router = express.Router();

module.exports = (db) => {
  // -- create new order: -- //
  router.post("/", (req, res) => {
    const userID = req.session.user_id;

    console.log(req.body);
    // TO DO:
    // if session is admin proceed, otherwise forbidden
    // get all data about the order and save it in db, send SMS to user, send SMS to admin, res.redirect("/:id/orders);
    // set timeout send sms when  time expires to user and update db with status - ready for pick up
    res.send("New order received!");
    // const query = `

    //     `;
    // const values = [userID];

    // db.query(query, values)
    //   .then(() => {})
    //   .catch((err) => {
    //     res.status(500).json({ error: err.message });
    //   });

    // res.status(403).json({ error: "Forbidden!" });
  });

  return router;
};
