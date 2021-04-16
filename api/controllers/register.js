const handleRegister = (db, bcrypt) => (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        Hash: hash,
        Email: email,
        FullName: name,
      })
      .into("Users")
      .returning(['Id','FullName','Email'])
      .then((user) => {
        res.json(user[0]);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json(err));
};

module.exports = {
  handleRegister: handleRegister,
};
