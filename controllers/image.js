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
  handleImage: handleImage
}