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

// console.log('About to connect to database...');
// function runQuery(queryFunction, callback) {
//   MongoClient.connect(url, { useUnifiedTopology: true },
//     (error,client) =>{
//       if(error){
//         callback('"ERROR!! Could not connect"');
//         return;
//       }
//       console.log('Connected to database');
//       const db = client.db(dbName);
//       const col = db.collection(collectionName);
//       queryFunction(col, callback)
//
//  }) //MongoClient.connect
// }//runQuery
//
//
//   const updateBoat =(col, callback) => {
//     let filter = {modelname: 'Cuddy Cabins'};
//     let setNewDocument = { $set: {production: 2003} };
//     col.updateMany(filter, setNewDocument,
//       (error,result)=>{
//       try{
//         if(error) {
//           console.log('Bad update query', error.message);
//           return;
//         }
//         console.log('Boats are updated', result.result);
//
//       }finally{
//          callback();
//       }
//
//     })
//   }
//
//   const deletedBoat = (col, callback) => {
//     col.deleteMany(a, (error,result) =>{
//       try {
//         if(error) {
//           console.log('Bad query to delete', error.message)
//         }
//         console.log('Boats are deleted', result.result);
//       }
//       finally{
//         callback();
//       }
//     })
//   }
//
// runQuery(updateBoat)
//
//
//
//
// const findBoats = async (col, filter, callback) =>{
//   try{
//     const cursor = await col.find(filter);
//     const array = await cursor.toArray();
//     callback(array);
//   }
//   catch(error){
//     console.log('Query error:', error.message);
//     callback('"ERROR!! Query error"');
//   }
//   finally{
//     callback();
//   }
//   // col.find(filter).toArray((error,docs) => {
//   //   try {
//   //     if(error) {
//   //       console.log('Bad find query', error.message);
//   //       return;
//   //     }
//   //     console.log('Found queries');
//   //     docs.forEach(doc => {
//   //       console.log('*', doc.modelname);
//   //     })
//   //   }finally {
//   //     callback();
//   //   }
//   // })
// }
//
// function insertBoats(col,callback) {
//   col.insertMany(
//     [
//       {modelname: 'Center Consoles', production: 2014, price: 2300.76, sailboat: 'yes', motor: 'no'},
//       {modelname: 'Cuddy Cabins', production: 20001, price: 11400.43, sailboat:'no', motor: 'yes'}
//     ],
//     (error,result) => {
//       try {
//         if(error) {
//           console.log('Bad insert query', error.message);
//           return;
//         }
//         console.log('Insert query succesful');
//         console.log(result);
//       }finally {
//         callback();
//       }
//     }
//   )
// }



// Response is: {
//   "result":{"n":1,"ok":1},
//   "connection":{
//         "_events":{},
//         "_eventsCount":4,
//         "id":1,
//         "address":"127.0.0.1:27017",
//         "bson":{},
//         "socketTimeout":360000,
//         "monitorCommands":false,
//         "closed":false,
//         "destroyed":false,
//         "lastIsMasterMS":1
//   },
//   "ops":[
//     {"modelname":"neda4","production":"33","price":"77","sailboat":"Yes","motor":"Yes","_id":"5f4b6de0c6df28624879fe4e"}
//   ],
//   "insertedCount":1,
//   "insertedId":"5f4b6de0c6df28624879fe4e",
//   "n":1,
//   "ok":1
// }

