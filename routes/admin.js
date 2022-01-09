const express = require("express");
const router = express.Router();
module.exports = (db) => {
  // @route    GET /orders
  // @desc     Get all active orders
  // @access   Private
  router.get("/orders", (req, res) => {
    // const session = req.session.user_id;
    //NOTE: USE RUTA checkCurrentUser and check if admin

    db.query(
      `SELECT orders.id, status, created_at, users.name as customer_name, users.phone_number, menu_items.name as menu_item
      FROM orders
      JOIN users ON orders.user_id = users.id
      JOIN selected_dishes ON selected_dishes.order_id = orders.user_id
      JOIN menu_items ON menu_items.id = selected_dishes.menu_item_id
      WHERE status = 'active';`
    )
      .then((data) => {
        const menuItems = data.rows;
        res.json({ menuItems });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // @route    PUT /orders/:order_id
  // @desc     Mark order as complete status
  // @access   Private
  router.put("/orders/:order_id", (req, res) => {
    // const session = req.session.user_id;
    //NOTE: USE RUTA checkCurrentUser and check if admin

    const { order_id } = req.params;
    const { status } = req.body;

    db.query(`SELECT * FROM orders WHERE id = $1;`, [order_id])
      .then((data) => {
        const menuItems = data.rows;
        const menu_item_id = menuItems[0].id;

        const query = "UPDATE orders SET status = $1 WHERE id=$2 RETURNING*";

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
  });

  return router;
};
