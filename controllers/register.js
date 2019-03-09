const handleRegister = (db,bcrypt) => (req,res) => {
  const {name,email,password} = req.body;
  if(!email || !name || !password){
      return res.status(400).json('incorrect form submision')
  }
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
};

module.exports = {
  handleRegister: handleRegister
}