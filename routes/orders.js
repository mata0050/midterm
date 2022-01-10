const express = require("express");
const pgp = require("pg-promise")();
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);

module.exports = (db) => {
  // -- create new order: -- //
  router.post("/", (req, res) => {
    const userID = req.session.user_id;

    // only save data if user is logged in
    if (userID) {
      const { phoneNumber } = req.body;
      console.log(phoneNumber);
      const orderDetails = req.body;
      const query = `
      INSERT INTO orders(status, created_at, user_id ) VALUES ( $1, $2, $3 ) RETURNING *
      `;
      const dateTime = new Date();
      const values = ["active", dateTime.toISOString(), userID];
      return (
        db
          .query(query, values)
          .then((data) => {
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
                  queryObj.query = `INSERT INTO selected_dishes( order_id, menu_item_id) VALUES ($1, $2) RETURNING *`;
                  queryObj.values = [orderID, itemID];
                  queries.push(queryObj);
                }
              }
            }
            // Concat all generated SQL statements and insert into db
            const sql = pgp.helpers.concat(queries);
            return db.query(sql);
          })
          .then((data) => {
            //query for details to send to the restaurant
            const orderID = data[0].rows[0].order_id;
            const query = `
            SELECT order_id, name AS dish,
            COUNT(menu_item_id) AS quantity
            FROM selected_dishes
            JOIN menu_items ON menu_items.id = menu_item_id
            WHERE order_id = $1
            GROUP BY order_id, menu_items.name;
            `;
            const values = [orderID];
            return db.query(query, values);
          })
          .then((data) => {
            //send SMS to restaurant admin with order details
            const order = data.rows;
            const orderID = order[0].order_id;
            let orderedDishes = "";
            for (let dishDetails of order) {
              let msg = `${dishDetails.dish}: ${dishDetails.quantity}\n`;
              orderedDishes += msg;
            }
            const sms = `New order for FoodSkip! Let's get cookin'! Order_nr: ${orderID}. Details: ${orderedDishes}`;
            return client.messages.create({
              to: "",
              from: twilioNumber,
              body: sms,
            });
          })
          .then((message) => {
            console.log(message);
          })
          // res.send("Order received!");
          .catch((err) => {
            res.status(500).json({ error: err.message });
            return;
          })
      );

      // set timeout send sms when  time expires to user and update db with status - ready for pick up
      // res.send("New order received!");
      return;
    }

    res.status(403).json({ error: "Must be logged in!" });
  });

  return router;
};
