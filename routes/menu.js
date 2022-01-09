/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // get all the menu items
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

  // create  a new menu item
  router.post("/", (req, res) => {
    // get userID from cookie
    // const userId = req.cookies['user_id'];
    // NOTE: waiting for auth
    const { userId, name, description, price, photo_url, preparation_time } =
      req.body;

    // check if user is admin
    const queryString = "SELECT * FROM users WHERE id = $1";


    db.query(queryString, [userId])
      .then((data) => {
        const user = data.rows;

        if (user.length === 0) {
          return res.status(404).send("Please login");
        }

        if (!user[0].admin) {
          return res.status(404).send("Please login as Admin");
        }

        const query =
          "INSERT INTO public.menu_items( name, description, price, photo_url, preparation_time) VALUES ( $1, $2, $3, $4, $5) RETURNING *";
        const values = [name, description, price, photo_url, preparation_time]

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

  return router;
};
