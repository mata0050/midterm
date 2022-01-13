const express = require("express");
const router = express.Router();

// utils
const userUndefined = require("../utils/userUndefined");

module.exports = (db) => {
  // @route    GET /admin/orders
  // @desc     Get all active orders
  // @access   Private
  router.get("/orders", (req, res) => {
    const session = req.session.user_id;

    // checks user
    userUndefined(session, res);

    // check if user exists and is Admin
    const queryString = "SELECT * FROM users WHERE id = $1 AND admin = 'true'";

    db.query(queryString, [session])
      .then((data) => {
        const user = data.rows;
        console.log(user);
        if (user.length !== 0) {
          // All active orders
          return db.query(
            `SELECT orders.id, status, created_at, users.name as customer_name, users.phone_number
         FROM orders
         JOIN users ON orders.user_id = users.id
         WHERE status = 'active'
       ORDER BY created_at DESC;`
          );
        }
        res.redirect("/menu");
        return;
      })
      .then((data) => {
        const orders = data.rows;
        const templateVars = {
          userID: session,
          orders,
        };
        res.render("admin_orders", templateVars);
        return;
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
        return;
      });
  });

  // @route    PUT /admin/orders/:order_id
  // @desc     Mark order as complete status
  // @access   Private
  router.put("/orders/:order_id", (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;
    const session = req.session.user_id;

    // checks user
    userUndefined(session, res);

    // check if user exists and is Admin
    const queryString = "SELECT * FROM users WHERE id = $1 AND admin = 'true'";

    db.query(queryString, [session])
      .then((data) => {
        const user = data.rows;
        if (user.length !== 0) {
          db.query(`SELECT * FROM orders WHERE id = $1;`, [order_id])
            .then((data) => {
              const menuItems = data.rows;
              const menu_item_id = menuItems[0].id;

              const query =
                "UPDATE orders SET status = $1 WHERE id=$2 RETURNING*";

              db.query(query, [status, menu_item_id])
                .then((data) => {
                  const orders = data.rows;
                  res.json(orders);
                })
                .catch((err) => {
                  res.status(500).json({ error: err.message });
                });
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // @route    GET /admin/menu
  // @desc     Get all the menu items
  // @access   Private
  router.get("/orders/menu", (req, res) => {
    const session = req.session.user_id;
    // add checks for user
    db.query(`SELECT * FROM menu_items;`)
      .then((data) => {
        const menuItems = data.rows;
        const templateVars = {
          userID: session,
          menuItems,
        };
        console.log(templateVars);
        res.render("admin_menu", templateVars);
        // res.json(menuItems);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
