const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const DBkey = require('./DBkey.json');

const register = require('./controllers/register.js'); 
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const deleteUser = require('./controllers/deleteUser.js');


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'ryan',
    password : DBkey.key,
    database : 'FaceRec'
  }
});


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => res.send(database.users) );

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt) );

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt) );

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db) );

app.put('/image', (req, res) => image.handleImage(req, res, db) );	

app.post('/imageurl', (req, res) => image.handleApiCall(req, res) );	

app.delete('/delete', (req, res) => deleteUser.handleDeleteUser(req, res, db) );

app.listen(3000, () => {
	console.log('app is running on port 3000');
});