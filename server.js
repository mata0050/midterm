// load .env data into process.env
require("dotenv").config();

// hello there.

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const cookieSession = require("cookie-session");
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(
  cookieSession({
    name: "session",
    keys: ["veryImportantKey1", "veryImportantKey2"],
  })
);
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
const menuRoutes = require("./routes/menu");
const adminRoutes = require("./routes/admin");
const logoutRoute = require("./routes/logout");
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/users", usersRoutes(db));
app.use("/orders", ordersRoutes(db));
app.use("/admin", adminRoutes(db));
app.use("/menu", menuRoutes(db));
app.use("/logout", logoutRoute());

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  const session = req.session.user_id;
  if (session) {
    res.redirect("/menu");
    return;
  }
  db.query(`SELECT * FROM menu_items LIMIT 6;`)
    .then((data) => {
      const menuItems = data.rows;
      const templateVars = {
        userID: session,
        menuItems,
      };
      res.render("index", templateVars);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// all 404 routes
app.get("*", (req, res) => {
  const session = req.session.user_id;

  // if user is logged in, redirect
  if (session) {
    res.redirect(`/users/${session}`);
    return;
  }
  res.status(404).send("Page does not exist!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
