const express = require("express");
const { checkCurrentUser } = require("../helpers/checkCurrentUser");
const router = express.Router();

module.exports = (db) => {
  // -- log in user and redirect: -- //
  router.get("/:id", (req, res) => {
    const userID = req.params.id;
    if (isNaN(userID)) {
      res.status(403).json({ error: "User does not exist" });
      return;
    }
    // check if user with this id exist in the db:
    db.query(`SELECT * FROM users WHERE id = $1;`, [userID])
      .then((data) => {
        const loggedInUser = data.rows[0];
        if (loggedInUser) {
          // create session for a logged in user and redirect accordingly:
          req.session.user_id = userID;
          if (loggedInUser.admin === true) {
            res.redirect("/admin/orders");
            return;
          }
          res.redirect("/menu");
          return;
        }
        res.status(403).json({ error: "User does not exist" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // -- show user's orders: -- //
  router.get("/:id/orders", (req, res) => {
    const session = req.session.user_id;
    const userID = req.params.id;
    if (isNaN(userID)) {
      res.status(403).json({ error: "User does not exist" });
      return;
    }

    // if correct user is logged, show their orders
    checkCurrentUser(session, userID, db).then((isCorrectUser) => {
      if (isCorrectUser) {
        const query = `
        SELECT orders.id AS order_nr,
        orders.status,
        orders.created_at AS time_ordered,
        JSON_AGG (json_build_object( 'menu_item_id', menu_items.id, 'menu_item_name', menu_items.name)) AS ordered_dishes,
        SUM(menu_items.preparation_time) AS waiting_time,
        SUM(menu_items.price) AS total_price
        FROM orders
        JOIN users ON users.id = user_id
        JOIN selected_dishes ON orders.id = order_id
        JOIN menu_items ON menu_items.id = menu_item_id
        WHERE user_id = $1
        GROUP BY orders.id
        ORDER BY orders.created_at DESC;
        `;
        const values = [userID];
        return db
          .query(query, values)
          .then((data) => {
            const orders = data.rows;
            console.log(orders[0]);
            const templateVars = {
              userID: session,
              orders,
            };
            console.log(templateVars);
            res.render("user_orders", templateVars);
            return;
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
            return;
          });
      }
      res.status(403).json({ error: "Must be logged in as correct user!" });
    });
  });

  return router;
};
