const express = require("express");
const router = express.Router();
module.exports = (db) => {
  // @route    GET /orders
  // @desc     Get all active orders
  // @access   Private
  router.get("/", (req, res) => {
    // const session = req.session.user_id;
    //NOTE: USE RUTA checkCurrentUser and check if admin

    db.query(
      `SELECT orders.id, status, created_at, users.name, users.phone_number, menu_items.name
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

  return router;
};
