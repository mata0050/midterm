const express = require("express");
const pgp = require("pg-promise")();
const router = express.Router();
const { checkCurrentUser } = require("../helpers/checkCurrentUser");

module.exports = (db) => {
  // -- create new order: -- //
  router.post("/", (req, res) => {
    const userID = req.session.user_id;

    // only save data if user is logged in
    if (userID) {
      const { phoneNumber } = req.body;
      console.log(phoneNumber);
      console.log(req.body);
      const orderDetails = req.body;
      const query = `
      INSERT INTO orders(status, created_at, user_id ) VALUES ( $1, $2, $3 ) RETURNING *
      `;
      const dateTime = new Date();
      const values = ["active", dateTime.toISOString(), userID];
      return db
        .query(query, values)
        .then((data) => {
          console.log("data,rows", data.rows);
          const order = data.rows[0];
          return order.id;
        })
        .then((orderID) => {
          // create queries for all selected items according to the quantity of each item
          let queries = [];
          for (const itemID in orderDetails) {
            const quantity = orderDetails[itemID];
            if (quantity !== phoneNumber) {
              for (let i = 0; i < quantity; i++) {
                let queryObj = {};
                queryObj.query = `INSERT INTO selected_dishes( order_id, menu_item_id) VALUES ($1, $2)`;
                queryObj.values = [orderID, itemID];
                queries.push(queryObj);
              }
            }
          }
          // Insert all generated SQL statements into db
          const sql = pgp.helpers.concat(queries);
          return db.query(sql);
        })
        .then(() => res.send("Order received!"))
        .catch((err) => {
          res.status(500).json({ error: err.message });
          return;
        });

      // set timeout send sms when  time expires to user and update db with status - ready for pick up
      // res.send("New order received!");
      return;
    }

    res.status(403).json({ error: "Must be logged in!" });
  });

  return router;
};
