const express = require ('express');
const bodyParser = require ('body-parser');
const bcrypt = require ('bcrypt-nodejs');

const app = express();
app.use(bodyParser.json())

const database = {
    users: [
        {
            id:'123',
            name:'emi',
            email:'emi@gmail.com',
            password:'mambito',
            entries: 0,//para contar la cantidad de veces que usa el facerecognition
            joined: new Date()
        },
        {
            id:'345',
            name:'pedro',
            email:'pedro@gmail.com',
            password:'pedrito',
            entries: 0,//para contar la cantidad de veces que usa el facerecognition
            joined: new Date()
        }
    ]
}

//devuelve un array con todos los que cumple la condicion (al ser un id sabemos que sera max uno)
const getUser = (id) => {
    let user = database.users.filter(user => {
        if(user.id === id){
            return user;
        }
    });

    if(user.length>0){
        return user[0]
    }else return null;
}

app.listen(3000);

app.get('/', (req,res) => {
    res.send(database.users);
});

app.post('/signin', (req,res) => {
    const {email,password} = req.body;

    const user = database.users.filter( (user) => {
        if(user.email===email){
            return user;
        }
    });

    if (user.length!==0){
        bcrypt.compare(password, user[0].password, function(err, compareResponse) {
            if (compareResponse){
                res.json("success");
            }
        });
    }else {
        res.status(400).json("password and user did not match, you assface");
    }
    
});

app.post('/register/', (req,res) => {
    const {name,email,password} = req.body;
    const passHashed = '';
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        database.users.push({
            id: '111',
            name: name,
            email: email,
            password: hash,
            entries: 0,
            joined: new Date()
        });
        console.log (database.users);
    });
    
    
    
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req,res) => {
    const {id} = req.params;
    let user = getUser(id);

    if(!user){
        res.status(400).json('no such user');
    }else{
        res.json(user);
        
    }
})

app.put('/image', (req,res) => {
    const {id} = req.body
    let user = getUser(id);
    if(user){
        user.entries++;
        res.json(user.entries);
    } else {
        res.status(400).json('not found such user');
    }


})

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