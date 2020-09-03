const express = require('express');

const bodyParser = require('body-parser');
const app = express();


const port = process.env.PORT || 2294;

const {getAllBoats,getBoat,insertBoat,deletedBoat,searchBoat} = require('./database.js');

let logger = (req,res,next) =>{
    console.log(`LOGGER: ${req.method} ${req.url}`);
    next();
}


app.use(logger);

app.use(express.static(__dirname + '/frontend'));

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );



app.get('/api/boats', (req,res)=>{
    getAllBoats(dataOrError =>{
      res.send(dataOrError)
    })
})

app.get('/api/boat', (req,res)=>{

  getBoat(req.query.id, dataOrError => {
    res.send(dataOrError)
  } )
 
})

app.get('/api/sortbymodel', (req,res) =>{
  let filtered = req.query.filtered;
  sortByName(filtered, dataOrError => {
    res.send(dataOrError)
  })
})

app.get('/api/search/' ,(req,res) => {
  let searchedWord = req.query.word;
  let searchedMaxPrice = Number(req.query.maxprice);
  let searchedIsSailBoat = req.query.is_sail;
  let searchedHasMotor = req.query.has_motor;
  let searchedYearBefore = Number(req.query.madebefore);
  let searchedYearAfter = Number(req.query.madeafter);
  let keySort = req.query.order;
  console.log(searchedWord);
  console.log(typeof(searchedMaxPrice));
  console.log(searchedIsSailBoat);
  console.log('order is:', req.query.order);


  searchBoat(searchedWord, searchedMaxPrice, searchedIsSailBoat, searchedHasMotor, searchedYearBefore, searchedYearAfter, keySort, dataOrError => {
    res.send(dataOrError)
  })
})

app.post('/api/boat', (req,res)=>{
  let newBoat = {modelname:req.body.modelname, production:req.body.production, price:req.body.price, sailboat:req.body.sailboat, motor:req.body.motor};

  insertBoat(newBoat, dataOrError => {
    res.send(dataOrError)
  })
  
})

app.delete('/api/boatdelete', (req,res)=>{
    console.log(req.query.id);
    deletedBoat(req.query.id, dataOrError => {
      res.send(dataOrError)
    })
    
})



app.use( (error, req, res, next) => {
    console.log('Error handling', error);
    res.status(500).send('Internal server error');
})

app.listen(port, ()=>{
    console.log('Web server listening on port:' + port);
})