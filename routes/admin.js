const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // @route    GET /admin/orders
  // @desc     Get all active orders
  // @access   Private
  router.get("/orders", (req, res) => {
    const session = req.session.user_id;

    // checks user
    if (!session) {
      console.log("Must be logged in!");
      res.redirect("/");
      return;
    }

    // check if user exists and is Admin
    const queryString = "SELECT * FROM users WHERE id = $1 AND admin = 'true'";

    db.query(queryString, [session])
      .then((data) => {
        const user = data.rows;
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

  // @route    GET /admin/orders/:id
  // @desc     Get order details
  // @access   Private
  router.get("/orders/:id", (req, res) => {
    const session = req.session.user_id;
    const orderID = req.params.id;
    let templateVars = {};

    // checks user
    if (!session) {
      console.log("Must be logged in!");
      res.redirect("/");
      return;
    }

    // check if user exists and is Admin
    const queryString = "SELECT * FROM users WHERE id = $1 AND admin = 'true'";

    db.query(queryString, [session])
      .then((data) => {
        const user = data.rows;
        if (user.length !== 0) {
          // Order details
          return db.query(
            ` SELECT orders.id AS order_nr,
            orders.status,
            orders.created_at AS time_ordered, users.name,
            SUM(menu_items.preparation_time) AS waiting_time,
            SUM(menu_items.price) AS total_price
            FROM orders
            JOIN users ON users.id = user_id
            JOIN selected_dishes ON orders.id = order_id
            JOIN menu_items ON menu_items.id = menu_item_id
            WHERE orders.id = $1
            GROUP BY orders.id, users.name
            ORDER BY orders.created_at DESC;
            `,
            [orderID]
          );
        }
        res.redirect("/menu");
        return;
      })
      .then((data) => {
        const order = data.rows[0];
        templateVars = {
          userID: session,
          order,
        };
        return db.query(
          `SELECT COUNT(orders.id), menu_items.name FROM menu_items
          JOIN selected_dishes ON menu_items.id = menu_item_id
          JOIN orders ON orders.id = order_id
          WHERE orders.id = $1
          GROUP BY menu_items.id
          `,
          [orderID]
        );
      })
      .then((data) => {
        const items = data.rows;
        templateVars.items = items;
        res.render("admin_order_details", templateVars);
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
  router.put("/orders/:id", (req, res) => {
    const orderID = req.params.id;
    const { status } = req.body;
    const session = req.session.user_id;

    // checks user
    if (!session) {
      console.log("Must be logged in!");
      res.redirect("/");
      return;
    }

    // check if user exists and is Admin
    const queryString = "SELECT * FROM users WHERE id = $1 AND admin = 'true'";
    db.query(queryString, [session])
      .then((data) => {
        const user = data.rows;
        if (user.length !== 0) {
          return db.query(
            `UPDATE orders SET status = $1 WHERE id= $2 returning *;`,
            [status, orderID]
          );
        }
        console.log("not admin");
        res.redirect("/menu");
        return;
      })
      .then(() => {
        console.log("Status updated!");
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
