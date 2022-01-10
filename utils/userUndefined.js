const userUndefined = (session, res) => {
  if (session === undefined) {
    res.redirect("/");
  }
};

module.exports = userUndefined;
