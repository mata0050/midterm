const userUndefined = (session, res) => {
  if (session === undefined) {
    console.log("Must be logged in!");
    res.redirect("/");
    return;
  }
};

module.exports = userUndefined;
