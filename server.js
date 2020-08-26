const express = require('express');

const bodyParser = require('body-parser');
const app = express();

const port = 2294;

let logger = (req,res,next) =>{
    console.log(`LOGGER: ${req.method} ${req.url}`);
    next();
}
app.use(logger);

app.use(express.static(__dirname + '/frontend'));

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

let data = [
    { modelname:'Aluminum Ribs', production:2015, price:1200.40, sailboat:'yes', motor:'yes'},
    { modelname:'Inflatable Rescue', production:2019, price:7600.40, sailboat:'no', motor:'yes'},
    { modelname:'Fiberglass Fishing Panga', production:1998, price:4300.40, sailboat:'no', motor:'yes'},
    { modelname:'Foldable Inflatable', production:2000, price:3800.42, sailboat:'no', motor:'yes'},
    { modelname:'Inflatable Catamaran', production:2011, price:2300.40, sailboat:'no', motor:'yes'},
    { modelname:'Fishing and Banana', production:2005, price:1300.90, sailboat:'no', motor:'yes'},
    { modelname:'Fiberglass Hulls', production:2013, price:5300.80, sailboat:'no', motor:'yes'}
]

app.get('/api/boats', (req,res)=>{
    res.send(data);
})

app.get('/api/boat', (req,res)=>{
  let model= req.query.modelname;
  let searchResult = data.filter(boat=>boat.modelname===model);
  res.send(searchResult);
})

app.post('/api/boat', (req,res)=>{
  let newBoat = {modelname:req.body.modelname, production:req.body.production, price:req.body.price, sailboat:req.body.sailboat, motor:req.body.motor};
  data.push(newBoat);
  res.send('New boat added');
})

app.delete('/api/boatdelete', (req,res)=>{
    let deletedBoat = req.query.modelname;
    data = data.filter(boat=>boat.modelname!==deletedBoat);
    res.send(`${deletedBoat} is deleted`);
})

app.get('/api/search' , (req,res)=>{
  let searchedItem = req.query.word;
  if(!searchedItem){res.send(data);}
  let filtered = data.filter(boat=>boat.modelname.toLowerCase().includes((searchedItem).toLowerCase()));
  let filteredDataToSend = JSON.stringify(filtered);
  res.send(filteredDataToSend);


})



app.use( (error, req, res, next) => {
    console.log('Error handling', error);
    res.status(500).send('Internal server error');
})

app.listen(port, ()=>{
    console.log('Web server listening on port:' + port);
})
