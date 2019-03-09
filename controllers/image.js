const clarifai = require ('clarifai');

const app = new Clarifai.App({
  apiKey: '5c1802b7ef804d32b4b9dc5d8e14340a'
 });

const handleApiCall = (req,res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then (data => res.json(data))
  .catch(err => res.status(400).json('unnable to work with API'))
}


const handleImage = (req,res,db) => {
  const {id} = req.body

  db('users').where('id' ,'=', id)
  .increment('entries',1)
  .returning('entries')
  .then(entries => {
      entries.length? res.json(entries[0]) : res.status(400).json('no va mas') //aunque no es buen plan mostrar que no existe tal usuario,
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}