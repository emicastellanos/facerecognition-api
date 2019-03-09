const express = require ('express');
const bodyParser = require ('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require ('cors');
const knex = require ('knex');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'postgres',
      database : 'face_reco_db'
    }
});


const app = express();

app.use(bodyParser.json())
app.use(cors())

//devuelve un array con todos los que cumple la condicion (al ser un id sabemos que sera max uno)
const getUser = (id) => {
    // let user = database.users.filter(user => {
    //     if(user.id === id){
    //         return user;
    //     }
    // });
     //probar lsa dos

    //db.select('*').table('users').where('id',id);
    db.select('*').table('users').where({id:id})
        .then(user => {
            console.log('getuser.' ,user)
            return user
        })
        .catch(err => res.status(400).json('problem in getUser'))
}

app.listen(3000);

app.get('/', (req,res) => {
    res.send(`it's working! `);
});

//ENDPOINTS 
app.post('/register/', register.handleRegister(db,bcrypt) ); //other way for doing the call seen below
app.post('/signin', (req,res) => signin.handleSignIn(req,res,db,bcrypt));
app.get('/profile/:id', (req,res) => profile.handleProfileGet(req,res,db))
app.put('/image', (req,res) => image.handleImage(req,res,db));
app.post('/imageurl', (req,res) => image.handleApiCall(req,res));


/*
/
/signin             --> POST = succes/fail
/register           --> POST = user
/profile/:userId    --> GET = user
/image              --> PUT = user ¿?

*/

/*
WAY TO CREATE A SUPERSECURE PASSWORD & LOGIN / AUTHETICATION

import bcrypt from'bcrypt'
const saltRounds = 10 // increase this if you want more iterations  
const userPassword = 'supersecretpassword'  
const randomPassword = 'fakepassword'

const storeUserPassword = (password, salt) =>  
  bcrypt.hash(password, salt).then(storeHashInDatabase)

const storeHashInDatabase = (hash) => {  
   // Store the hash in your password DB
   return hash // For now we are returning the hash for testing at the bottom
}

// Returns true if user password is correct, returns false otherwise
const checkUserPassword = (enteredPassword, storedPasswordHash) =>  
  bcrypt.compare(enteredPassword, storedPasswordHash)


// This is for demonstration purposes only.
storeUserPassword(userPassword, saltRounds)  
  .then(hash =>
    // change param userPassword to randomPassword to get false
    checkUserPassword(userPassword, hash)
  )
  .then(console.log)
  .catch(console.error) */