const express = require ('express');
const bodyParser = require ('body-parser');

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
    if(req.body.email == database.users[0].email && 
        req.body.password == database.users[0].password){
            res.json("success");
    }else {
        res.json("error logging in");
    }
    
});

app.post('/register/', (req,res) => {
    const {name,email,password} = req.body;
    database.users.push({
        id: '111',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
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
