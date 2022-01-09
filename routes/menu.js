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
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM menu_items;`)
      .then((data) => {
        const menuItems = data.rows;
        res.json({ menuItems });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // @route    POST /api/menu
  // @desc     Create a new item
  // @access   Private
  router.post("/", (req, res) => {
    // const userId = req.cookies['user_id'];
    const { userId, name, description, price, photo_url, preparation_time } =
      req.body;

    // check if user exists
    const queryString = "SELECT * FROM users WHERE id = $1";

    db.query(queryString, [userId])
      .then((data) => {
        const user = data.rows;

        // check if user Admin
        checkUserIsAdmin(user, res);

        const query =
          "INSERT INTO menu_items( name, description, price, photo_url, preparation_time) VALUES ( $1, $2, $3, $4, $5) RETURNING *";
        const values = [name, description, price, photo_url, preparation_time];

        db.query(query, values)
          .then((data) => {
            const menuItems = data.rows;
            res.json({ menuItems });

            // returns new item
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // @route    PUT /api/menu
  // @desc     Update menu item
  // @access   Private
  router.put("/", (req, res) => {
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

    // check if user exists
    const queryString = "SELECT * FROM users WHERE id = $1";

    db.query(queryString, [userId])
      .then((data) => {
        const user = data.rows;

        // check if user Admin
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
        const findMenuItem = "SELECT * FROM menu_items WHERE id = $1";
        db.query(findMenuItem, [menu_item_id])
          .then((data) => {
            if (data.rows.length === 0) {
              res.status(500).json({ error: err.message });
            }

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

            db.query(query, values)
              .then((data) => {
                const menuItem = data.rows;
                // returns update item
                res.json(menuItem);
              })
              .catch((err) => {
                res.status(500).json({ error: err.message });
              });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // @route    DELETE /api/menu
  // @desc     Delete menuitem from table
  // @access   Private
  router.delete("/", (req, res) => {
    // const userId = req.cookies['user_id'];
    const { userId, menu_item_id } = req.body;

    // check if user exists
    const queryString = "SELECT * FROM users WHERE id = $1";

    db.query(queryString, [userId])
      .then((data) => {
        const user = data.rows;

        // check if user Admin
        checkUserIsAdmin(user, res);

        const query = "DELETE FROM menu_items WHERE id = $1";
        const values = [menu_item_id];

        db.query(query, values)
          .then((data) => {
            const menuItems = data.rows;
            res.json("Item deleted");
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
