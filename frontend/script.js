  // let boatList = document.querySelector('#boatList');
window.addEventListener('load', async ()=>{
    let boatList = document.querySelector('#boatList');

    let showBoatsButton = document.querySelector('#showBoatsButton');
    let inputName = document.querySelector('#inputName');
    let inputPrice = document.querySelector('#inputPrice');
    let inputYear = document.querySelector('#inputYear');
    let inputSailboat = document.querySelector('#inputSailboat');
    let motorDiv = document.getElementById('#motorDiv');
    let sailboatDiv = document.getElementById('#sailboatDiv');
    let searchModel = document.querySelector('#searchModel');
    let addButton = document.querySelector("#addButton");
    let boatObject;

    // showBoatsButton.addEventListener('click', async ()=>{
    boatList.innerHTML = '';
     const response = await fetch('/api/boats',{
         method:'GET'
     });
     boatObject = await response.json();
     console.log('Fetch boatList:',boatObject );
     boatObject.forEach( boat => {
       createboats(boat.modelname,boat.motor,boat.price,boat.production,boat.sailboat);
        // let boatItem = document.createElement('div');
        // boatItem.innerHTML = `modelname:${boat.modelname}` + "<br />" + `motor:${boat.motor}` +
        //  "<br />" + `price:${boat.price}` + "<br />" + `productionyear:${boat.production}`+  "<br />" +
        //  `sailboat:${boat.sailboat}` + "<br />";
        //
        //  boatList.appendChild(boatItem);
        // let deleteButton = document.createElement('button');
        // deleteButton.innerText = 'Delete!';
        // boatItem.appendChild(deleteButton);
        // deleteButton.addEventListener('click', async ()=>{
        //   const deleteResponse = await fetch(`/api/boatdelete?modelname=${boat.modelname}`,{method: 'DELETE'});
        //    const deleteResult = await deleteResponse.text();
        //    console.log('delete result:', deleteResult);
        //    boatList.removeChild(boatItem);
        //
        // })//deleteButton
     });//boatObject.forEach

     searchModel.addEventListener('input', async (event) =>{
         boatList.innerHTML= '';
         const searchResponse = await fetch(`/api/search?word=${event.target.value}` , {method:'GET'});
         let filteredBoats = await searchResponse.json();
         console.log('filtered boats are:', filteredBoats);
         boatObject = filteredBoats;
         boatObject.forEach( boat => {
           createboats(boat.modelname,boat.motor,boat.price,boat.production,boat.sailboat);
         });

     })




    addButton.addEventListener('click' , async ()=>{
      let modelname = inputName.value;
      let motor;
      let sailboat;
      let motorDivObtions = motorDiv.querySelectorAll("input");
      let sailboatDivObtions = sailboatDiv.querySelectorAll("input");
      let price = inputPrice.value;
      let production = inputYear.value;


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
       const text = await response.text();
       console.log('Response is:', text);
        createboats(modelname,motor,price,production,sailboat)
       // let boatItem = document.createElement('div');
       // let deleteButton = document.createElement('button');
       // deleteButton.innerText = 'Delete!';
       // // boatItem.innerHTML = `modelname:${modelname}, motor:${motor}, price:${price}, productionyear:${production}, sailboat:${sailboat}`
       // boatItem.innerHTML = `modelname:${modelname}` + "<br />" + `motor:${motor}` +
       //  "<br />" + `price:${price}` + "<br />" + `productionyear:${production}`+  "<br />" +
       //  `sailboat:${sailboat}` + "<br />";
       //
       //  boatList.appendChild(boatItem);
       //  boatItem.appendChild(deleteButton);
       //  deleteButton.addEventListener('click', async ()=>{
       //    const deleteResponse = await fetch(`/api/boatdelete?modelname=${modelname}`,{method: 'DELETE'});
       //     const deleteResult = await deleteResponse.text();
       //     console.log('delete result:', deleteResult);
       //     boatList.removeChild(boatItem);
       //
       //  }) //deleteButton
  })//addButton


  function createboats(modelname,motor,price,production,sailboat) {
    let boatItem = document.createElement('div');
    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete!';
    // boatItem.innerHTML = `modelname:${modelname}, motor:${motor}, price:${price}, productionyear:${production}, sailboat:${sailboat}`
    boatItem.innerHTML = `modelname:${modelname}` + "<br />" + `motor:${motor}` +
     "<br />" + `price:${price}` + "<br />" + `productionyear:${production}`+  "<br />" +
     `sailboat:${sailboat}` + "<br />";

     boatList.appendChild(boatItem);
     boatItem.appendChild(deleteButton);
     deleteButton.addEventListener('click', async ()=>{
       const deleteResponse = await fetch(`/api/boatdelete?modelname=${modelname}`,{method: 'DELETE'});
        const deleteResult = await deleteResponse.text();
        console.log('delete result:', deleteResult);
        boatList.removeChild(boatItem);

     }) //deleteButton
  }



})//window
