const handleProfileGet = (req,res,db) => {
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
}

module.exports = {
  handleProfileGet: handleProfileGet
}

