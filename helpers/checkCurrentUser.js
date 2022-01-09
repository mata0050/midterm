//check if current logged in user is accessing their orders
const checkCurrentUser = (session, userID, db) => {
  return db
    .query(`SELECT * FROM users WHERE id = $1;`, [userID])
    .then((data) => {
      const user = data.rows[0];
      return user.id === Number(session);
    })
    .catch((err) => err);
};

module.exports = {
  checkCurrentUser,
};
