const handleSignIn = (req,res,db,bcrypt) => {
  const {email,password} = req.body;

  if(!email || !password){
      return res.status(400).json('')
  }

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
  
};

module.exports = {
  handleSignIn : handleSignIn
}