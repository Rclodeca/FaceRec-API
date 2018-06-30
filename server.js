const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const DBkey = require('./DBkey.json');

const register = require('./controllers/register.js'); 
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'ryan',
    password : DBkey.key,
    database : 'FaceRec'
  }
});

/*db.select('*').from('users').then(data => {
	console.log(data);
});*/

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send(database.users); 
})

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt) );

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt) );

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db) );

app.put('/image', (req, res) => {
	const { id } = req.body;
	
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('Unable to get entries'));
});		

app.delete('/delete', (req, res) => {
	const { id } = req.body;

	db('users')
		.where('id', '=', id)
		.del()
		.returning('email')
		.then(loginEmail => {
			db('login')
				.where('email', '=', loginEmail[0])
				.del()
				.returning('email')
				.then(data => res.status(200).josn('success'))
				.catch(err => res.status(400).json(err));
		})
});

app.listen(3000, () => {
	console.log('app is running on port 3000');
});