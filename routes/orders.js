const express = require("express");
const { checkCurrentUser } = require("../helpers/checkCurrentUser");
const router = express.Router();

module.exports = (db) => {
  // -- create new order: -- //
  router.post("/orders", (req, res) => {
    const session = req.session.user_id;

    console.log(req.body);
    // TO DO:
    // if session is admin proceed, otherwise forbidden
    // get all data about the order and save it in db, send SMS to user, send SMS to admin, res.redirect("/:id/orders);

    const query = `

        `;
    const values = [userID];

    db.query(query, values)
      .then(() => {})
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

    res.status(403).json({ error: "Forbidden!" });
  });

  return router;
};
