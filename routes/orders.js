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

    // only proceed with order if user is logged in
    if (userID) {
      const { userPhoneNumber, prepTime } = req.body;
      console.log(userPhoneNumber);
      let adminPhoneNumber = "";
      let orderID = "";

      // get admin's phone number
      const query = `
      SELECT users.phone_number FROM users
      WHERE admin = $1
      `;
      const values = [true];
      return db
        .query(query, values)
        .then((data) => {
          adminPhoneNumber = data.rows[0].phone_number;
        })
        .then(() => {
          // create new order
          const query = `
            INSERT INTO orders(status, created_at, user_id ) VALUES ( $1, $2, $3 ) RETURNING *
            `;
          const dateTime = new Date();
          const values = ["active", dateTime.toISOString(), userID];
          return db.query(query, values);
        })

        .then((data) => {
          const order = data.rows[0];
          orderID = order.id;
        })
        .then(() => {
          // create queries for all selected items according to the quantity of each item
          const orderDetails = req.body;
          let queries = [];
          for (const itemID in orderDetails) {
            const quantity = orderDetails[itemID];
            if (quantity !== userPhoneNumber && quantity !== prepTime) {
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
        .then(() => {
          //query for details to send to the restaurant
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
          let orderedDishes = "";
          for (let dishDetails of order) {
            let msg = `${dishDetails.dish}: ${dishDetails.quantity}\n`;
            orderedDishes += msg;
          }
          const sms = `New order for FoodSkip! Let's get cookin'! Order_nr: ${orderID}. Details: ${orderedDishes}`;
          return client.messages.create({
            to: adminPhoneNumber,
            from: twilioNumber,
            body: sms,
          });
        })
        .then(() => {
          // send order confirmation sms to user
          const sms = `Thank you for ordering at FoodSkip! Your order number is ${orderID}. Approximate waiting time: ${prepTime}. We will send you another message when your order is ready for pickup!`;
          return client.messages.create({
            to: userPhoneNumber,
            from: twilioNumber,
            body: sms,
          });
        })
        .then(() => {
          res.send("Order received!");
          return;
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
          return;
        });
    }
    res.status(403).json({ error: "Must be logged in!" });
  });

  return router;
};
