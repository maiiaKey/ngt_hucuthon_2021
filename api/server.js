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
      // connectionString : process.env.DATABASE_URL, // this is for production
      // ssl: true // this is for production
      host: 'localhost',
      user: 'postgres',
      password: 'app64data',
      database: 'learningpet'
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
