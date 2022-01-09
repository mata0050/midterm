/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

// utils
const checkUserIsAdmin = require("../utils/checkUserIsAdmin");

module.exports = (db) => {
  // @route    GET /api/menu
  // @desc     Get all the menu items
  // @access   Public
  router.get("/", async (req, res) => {
    try {
      const results = await db.query(`SELECT * FROM menu_items;`);
      const menuItems = results.rows;
      res.json({ menuItems });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // @route    POST /api/menu
  // @desc     Create a new item
  // @access   Private
  router.post("/", async (req, res) => {
    // const userId = req.cookies['user_id'];
    const { userId, name, description, price, photo_url, preparation_time } =
      req.body;

    try {
      // check if user exists
      const queryString = "SELECT * FROM users WHERE id = $1";
      const findUser = await db.query(queryString, [userId]);
      const user = findUser.rows;

      checkUserIsAdmin(user, res);

      //add new item to menu_items table
      const query =
        "INSERT INTO menu_items( name, description, price, photo_url, preparation_time) VALUES ( $1, $2, $3, $4, $5) RETURNING *";
      const values = [name, description, price, photo_url, preparation_time];

      const new_menu_item = await db.query(query, values);
      const menuItems = new_menu_item.rows;

      res.json({ menuItems });
    } catch (eer) {
      res.status(500).json({ error: err.message });
    }
  });

  // @route    PUT /api/menu
  // @desc     Update menu item
  // @access   Private
  router.put("/", async (req, res) => {
    // get userID from cookie
    // const userId = req.cookies['user_id'];
    // NOTE: waiting for auth
    const {
      userId,
      menu_item_id,
      name,
      description,
      price,
      photo_url,
      preparation_time,
    } = req.body;

    try {
      // check if user exists
      const queryString = "SELECT * FROM users WHERE id = $1";
      const findUser = await db.query(queryString, [userId]);
      const user = findUser.rows;

      checkUserIsAdmin(user, res);

      let newItem = {
        name,
        description,
        price,
        photo_url,
        preparation_time,
      };

      if (name) newItem.name = name;
      if (description) newItem.description = description;
      if (price) newItem.price = price;
      if (photo_url) newItem.photo_url = photo_url;
      if (preparation_time) newItem.preparation_time = preparation_time;

      //find if item exists
      const findMenuItem = await db.query(
        "SELECT * FROM menu_items WHERE id = $1",
        [menu_item_id]
      );

      if (findMenuItem.rows.length === 0) {
        res.status(500).json({ error: err.message });
      }

      // update
      const query =
        "UPDATE menu_items SET name = $1, description = $2, price = $3, photo_url = $4, preparation_time =$5 WHERE id = $6 RETURNING*";
      const values = [
        newItem.name,
        newItem.description,
        newItem.price,
        newItem.photo_url,
        newItem.preparation_time,
        menu_item_id,
      ];

      const updateMenu = await db.query(query, values);
      const menuItem = updateMenu.rows;
      // returns update item
      res.json(menuItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // @route    DELETE /api/menu
  // @desc     Delete menuitem from table
  // @access   Private
  router.delete("/", async (req, res) => {
    // const userId = req.cookies['user_id'];
    const { userId, menu_item_id } = req.body;

    try {
      // check if user exists
      const queryString = "SELECT * FROM users WHERE id = $1";
      const findUser = await db.query(queryString, [userId]);
      const user = findUser.rows;

      checkUserIsAdmin(user, res);

      const deleteItem = await db.query(
        "DELETE FROM menu_items WHERE id = $1",
        [menu_item_id]
      );
      res.json("Item deleted");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
