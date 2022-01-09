const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    const userID = req.params.id;
    db.query(`SELECT * FROM users WHERE id = $1;`, [userID])
      .then((data) => {
        const loggedInUser = data.rows[0];
        if (loggedInUser) {
          req.session.user_id = userID;
          console.log(" Log in user: ", loggedInUser);
          if (loggedInUser.admin === true) {
            res.redirect("/admin/orders");
          } else {
            res.redirect("/menu");
          }
        } else {
          res.status(403).json({ error: "User does not exist" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
