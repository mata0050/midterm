const express = require("express");
const pgp = require("pg-promise")();
const router = express.Router();
const { checkCurrentUser } = require("../helpers/checkCurrentUser");

module.exports = (db) => {
  // -- create new order: -- //
  router.post("/", (req, res) => {
    const userID = req.session.user_id;

    if (userID) {
      const { phoneNumber } = req.body;
      console.log(phoneNumber);
      console.log(req.body);
      // TO DO:
      // if session is admin proceed, otherwise forbidden
      // get all data about the order and save it in db, send SMS to user, send SMS to admin, res.redirect("/:id/orders);
      const orderDetails = req.body;
      const dateTime = new Date();

      const query = `
          INSERT INTO orders(status, created_at, user_id ) VALUES ( $1, $2, $3 ) RETURNING *
          `;

      const values = ["active", dateTime.toISOString(), userID];
      console.log(values);

      // return db
      //   .query(query, values)
      //   .then((data) => {
      //     const orders = data.rows;
      //     console.log(orders[0]);
      //   })
      //   .catch((err) => {
      //     res.status(500).json({ error: err.message });
      //     return;
      //   });

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
          console.log(pgp);
          const sql = pgp.helpers.concat(queries);
          console.log(sql);
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

    // db.query(queryString, [userID])
    //   .then((data) => {
    //     const user = data.rows;
    //     checkUserIsAdmin(user, res);
    //     const query =
    //       "INSERT INTO menu_items( name, description, price, photo_url, preparation_time) VALUES ( $1, $2, $3, $4, $5) RETURNING *";
    //     const values = [name, description, price, photo_url, preparation_time];
    //     return query(query, values);
    //   })
    //   .then((data) => {
    //     const menuItems = data.rows;
    //     res.json({ menuItems });

    //     // returns new item
    //   })
    //   .catch((err) => {
    //     res.status(500).json({ error: err.message });
    //   });

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
