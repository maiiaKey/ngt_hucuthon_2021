const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const marks = require('./controllers/marks');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 
const db = knex({
    client: 'pg',
    connection: {
      host: 'ec2-34-225-167-77.compute-1.amazonaws.com',
      user: 'fptyrwvjazvwvl',
      password: '20c8d78ee96a678dc60bc65d1af4341e0ab15765e89ce96b49caf412a9b705e4',
      database: 'd2cjfkmuoi4uma',
      ssl: true
    }
});

const app = express();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => { res.send('it is working')});
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt)); //should not be used on FE for the purpose of this Demo. 
app.get('/marks/:id/total', marks.handleGetTotalMarks(db));

app.listen(process.env.PORT || 4000, () => {
    console.log(`app is running on port ${process.env.PORT || 4000}`)
});
