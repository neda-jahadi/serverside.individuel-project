const { MongoClient, ObjectID } = require('mongodb')
const url = 'mongodb://localhost:27017';
const dbName = 'goteborgaren_bera';
const collectionName = 'boats';

function getAllBoats(callback) {
  get({}, callback)
}

function getBoat(id,callback) {
get({ _id: new ObjectID(id) }, array => callback( array[0] ))
}

function searchBoat(filterword, filterprice, filterSailBoat, filterHasMotor, filterMadeBefore, filterMadeAfter, keySort, callback) {
    
    let sortFilter = {}
    if((keySort === 'name_asc') || (keySort === 'name_desc')) {
        if(keySort === 'name_asc') {
             sortFilter = {modelname: 1}
            }else{
                sortFilter = {modelname: -1}
            }
            console.log('sort filter is: ', sortFilter);
        sortAlphabetical({modelname: {"$regex": `.*${filterword}.*`, $options: "i"}, price: {$lt: filterprice}, sailboat: filterSailBoat, motor: filterHasMotor, production: {$lt: filterMadeBefore}, production: {$gte: filterMadeAfter}}, sortFilter , array => callback( array ))
    
    }else{

            if(keySort === 'lowprice'){
                sortFilter = {price: 1}
                console.log('sort filter is:', sortFilter);
        }else if(keySort === 'oldest') {
            sortFilter = {production: 1}
            console.log('sort filter is:', sortFilter);
        }else {
            sortFilter = {production: -1}
        }
        console.log('sort filter is: ', sortFilter);
        sortAndSearch({modelname: {"$regex": `.*${filterword}.*`, $options: "i"}, price: {$lt: filterprice}, sailboat: filterSailBoat, motor: filterHasMotor, production: {$lt: filterMadeBefore}, production: {$gte: filterMadeAfter}}, sortFilter, array => callback( array ))
   
    }

    
}


function sortAlphabetical(filter, sortfilter, callback){
    
    console.log('start to sort and search with sortAlphabetical...');
    MongoClient.connect(
      url,
      {  useUnifiedTopology: true },
      async (error,client) => {
        if(error) {
          callback('"ERROR!! Could not connect"');
          return;
        }
        const col = client.db(dbName).collection(collectionName);
        try {
          const cursor =  await col.find(filter).collation({'locale':'en'}).sort(sortfilter);
          
          const array = await cursor.toArray();
          // console.log('cursor to array', array);
          callback(array);
        }catch(error) {
          console.log('Querry error:', error.message);
          callback('"ERROR!! Query error"');
  
        } finally {
          client.close();
        }
      }
    )

    
}

function sortAndSearch(filter, sortfilter,callback) {
    
   console.log('start to sort and search with sortAndSearch...');
  MongoClient.connect(
    url,
    {  useUnifiedTopology: true },
    async (error,client) => {
      if(error) {
        callback('"ERROR!! Could not connect"');
        return;
      }
      const col = client.db(dbName).collection(collectionName);
      try {
        
        const cursor = await col.find(filter).sort(sortfilter);
        const array = await cursor.toArray();
        // console.log('cursor to array', array);
        callback(array);
      }catch(error) {
        console.log('Querry error:', error.message);
        callback('"ERROR!! Query error"');

      } finally {
        client.close();
      }
    }
  )
}

function deletedBoat(id, callback) {

  deleteItem({ _id: new ObjectID(id) }, itemToBeDeleted => callback(itemToBeDeleted))

}

function insertBoat(newBoat, callback) {
  MongoClient.connect(
    url,
    {  useUnifiedTopology: true },
    async (error,client) => {
      if(error) {
        callback('"ERROR!! Could not connect"');
        return;
      }
      const col = client.db(dbName).collection(collectionName);
      try {
        const cursor = await col.insertOne(newBoat);

        callback(cursor.insertedId);
      }catch(error) {
        console.log('Querry error:', error.message);
        callback('"ERROR!! Query error"');

      } finally {
        client.close();
      }
    }
  )
}

function get(filter, callback) {
    
  MongoClient.connect(
    url,
    {  useUnifiedTopology: true },
    async (error,client) => {
      if(error) {
        callback('"ERROR!! Could not connect"');
        return;
      }
      const col = client.db(dbName).collection(collectionName);
      try {
          console.log('type of filter is:', typeof(filter));
        
            const cursor = await col.find(filter)
        
        

        const array = await cursor.toArray();
        console.log('cursor to array', array);
        callback(array);
      }catch(error) {
        console.log('Querry error:', error.message);
        callback('"ERROR!! Query error"');

      } finally {
        client.close();
      }
    }
  )
}


function deleteItem(filter,callback) {
  MongoClient.connect(
    url,
    {  useUnifiedTopology: true },
    async (error,client) => {
      if(error) {
        callback('"ERROR!! Could not connect"');
        return;
      }
      const col = client.db(dbName).collection(collectionName);
      try {
        const itemToBeDeleted = await col.deleteOne(filter);
        callback(itemToBeDeleted);
      }catch(error) {
        console.log('Querry error:', error.message);
        callback('"ERROR!! Query error"');

      } finally {
        client.close();
      }
    }
  )
}

module.exports = {getAllBoats,getBoat, insertBoat, deletedBoat, searchBoat}

