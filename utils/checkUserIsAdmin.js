const checkUserIsAdmin = (user, res) => {
  if (user.length === 0) {
    return res.status(404).send("Please login");
  }

  if (!user[0].admin) {
    return res.status(404).send("Please login as Admin");
  }
};

module.exports = checkUserIsAdmin;
