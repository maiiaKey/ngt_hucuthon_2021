const handleSignin = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    db.select('Email', 'Hash').from('Users')
    .where('Email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].Hash);
        if (isValid) {
            return db.select('*').from('Users')
            .where('Email','=', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin: handleSignin
}