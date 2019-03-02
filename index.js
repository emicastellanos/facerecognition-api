const express = require ('express');
const bodyParser = require ('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require ('cors');
const knex = require ('knex');

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
    res.send(database.users);
});

app.post('/signin', (req,res) => {
    const {email,password} = req.body;

    db.select('*').table('login')
    .where('email','=', email)
    .then(data => {
        if(data.length){
            if(bcrypt.compareSync(password, data[0].hash)){
                db.select('*').from('users')
                .where('email','=',email)
                .then(user => res.json(user[0]))
                .catch(err => res.status(400).json('unable to get user'))
            }else {
                res.status(400).json("password and user did not match, you assface"); //para no decir que no existe el email ese
            }
        }else {
            res.status(400).json("password and user did not match, you asshole"); 
        }
    })
    .catch(err => res.status(400).json('error in signin'))
    
});

app.post('/register/', (req,res) => {
    const {name,email,password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(user => {
                        console.log(user[0])
                        res.json(user[0])})
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
    /* manera asincronica, se llama y js continua la ejecucion hasta que la funcion de adentro retorna algo
     password: bcrypt.hash(password, null, null, function(err, hash) {
         return hash;
     }), */
});

app.get('/profile/:id', (req,res) => {
    const {id} = req.params;
    
    db.select('*').table('users').where({id:id})
        .then(user => {
            if (user.length){
                res.json(user)
            }else {
                res.status(400).json('NOT FOUND')
            }
        })
        .catch(err => res.status(400).json('problem in getUser'))
    
})

app.put('/image', (req,res) => {
    const {id} = req.body

    db('users').where('id' ,'=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        entries.length? res.json(entries[0]) : res.status(400).json('no va mas') //aunque no es buen plan mostrar que no existe tal usuario,
    })
    .catch(err => res.status(400).json('unable to get entries'))

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