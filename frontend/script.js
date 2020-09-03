
 window.addEventListener('load', async ()=>{
    let boatList = document.querySelector('#boatList');

    let sortNameAscending = document.querySelector('#sortNameAscending');
    let sortNameDescending = document.querySelector('#sortNameDescending');
    let sortYearAscending = document.querySelector('#sortOldToYoung');
    let sortYearDescending = document.querySelector('#sortYoungToOld');
    let inputName = document.querySelector('#inputName');
    let inputPrice = document.querySelector('#inputPrice');
    let inputYear = document.querySelector('#inputYear');
    let inputSailboat = document.querySelector('#inputSailboat');
    let motorDiv = document.getElementById('#motorDiv');
    let sailboatDiv = document.getElementById('#sailboatDiv');
    let sortPrice = document.querySelector('#sortPrice');

    let sortOrder = 'lowprice';
    

    let searchModel = document.querySelector('#searchModel');
    let searchMaxPrice = document.querySelector('#searchMaxPrice');
    let sailboatChoiceSearch = document.querySelector('#sailboatSearch');
    let hasMotorChoiceSearch = document.querySelector('#hasMotorSearch');
    let maxProductionYear= document.querySelector('#madebeforeSearch');
    let minProductionYear= document.querySelector('#madeafterSearch');
    
    

    let searchButton = document.querySelector("#search");
    
    

    let addButton = document.querySelector("#addButton");
    let boatObject;
    let sortedByName;
    let filteredBoats = [];
    let modelInputValue = '';
    let maxPriceInputValue;

    boatList.innerHTML = '';

     
     const response = await fetch('/api/boats',{
         method:'GET'
     });
     boatObject = await response.json();
     console.log('Fetch boatList:',boatObject );



     boatObject.forEach( boat => {
       createboats(boat.modelname,boat.motor,boat.price,boat.production,boat.sailboat, boat._id);
     });//boatObject.forEach

     

     searchModel.addEventListener('input', (event) =>{
        
         modelInputValue = event.target.value;
     })

     searchMaxPrice.addEventListener('input', (event) => {
         maxPriceInputValue = event.target.value;
         
     })

     sortNameAscending.addEventListener('click',  ()=>{
        
        sortOrder = 'name_asc';
        
      })

      sortNameDescending.addEventListener('click', () => {
          sortOrder = 'name_desc';
      })

      sortYearAscending.addEventListener('click', () => {
          sortOrder = 'oldest';
      })
      
      sortYearDescending.addEventListener('click', () => {
          sortOrder = 'newest'
      })

      sortPrice.addEventListener('click', () => {
         sortOrder ='lowprice'
      })

     searchButton.addEventListener('click', async () => {
          boatList.innerHTML= '';
        const searchResponse = await fetch(`/api/search/?word=${modelInputValue}&maxprice=${maxPriceInputValue}&is_sail=${sailboatChoiceSearch.value}&has_motor=${hasMotorChoiceSearch.value}&madebefore=${maxProductionYear.value}&madeafter=${minProductionYear.value}&order=${sortOrder}` , {method:'GET'});
         filteredBoats = await searchResponse.json();
         console.log('filtered boats are:', filteredBoats);
         boatObject = filteredBoats;
         if (filteredBoats.length === 0){
            let noResultMessage = document.createElement('p');
            noResultMessage.innerText = 'No boat is matching your search...';
            boatList.appendChild(noResultMessage);
         }else{
         boatObject.forEach( boat => {
           createboats(boat.modelname,boat.motor,boat.price,boat.production,boat.sailboat,boat._id);
         });
         }

     } )
         
    

     





    addButton.addEventListener('click' , async ()=>{
      let modelname = inputName.value;
      let motor;
      let sailboat;
      let motorDivObtions = motorDiv.querySelectorAll("input");
      let sailboatDivObtions = sailboatDiv.querySelectorAll("input");
      let price = Number(inputPrice.value);
      let production = Number(inputYear.value);


      for (let i=0; i<2; i++){
          if(motorDivObtions[i].checked){
            motor = motorDivObtions[i].value;
          }
      }

      for (let i=0; i<2; i++){
          if(sailboatDivObtions[i].checked){
            sailboat = sailboatDivObtions[i].value;
          }
      }

      let newItem = {modelname, production, price, sailboat, motor};

      const response = await fetch('/api/boat', {
        method:"POST",
        headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify(newItem)
          })
       const id = await response.text();
       console.log(id);
        createboats(modelname,motor,price,production,sailboat,id)
       
  })


  function createboats(modelname,motor,price,production,sailboat,id) {
    let boatItem = document.createElement('div');
    boatItem.classList.add("eachBoatStyle");
    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete!';
    boatItem.innerHTML = `modelname : ${modelname}` + "<br />" + `motor :${motor}` +
     "<br />" + `price :${price}` + "<br />" + `productionyear :${production}`+  "<br />" +
     `sailboat :${sailboat}` + "<br />";

     boatList.appendChild(boatItem);
     boatItem.appendChild(deleteButton);
     deleteButton.addEventListener('click', async ()=>{
        const deleteResponse = await fetch(`/api/boatdelete?id=${id}`,{method: 'DELETE'});
        const deleteResult = await deleteResponse.text();
        console.log('delete result:', deleteResult);
        boatList.removeChild(boatItem);

     }) //deleteButton
  }



})//window