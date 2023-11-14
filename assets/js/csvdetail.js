
let csvFileName = document.querySelector('#filename').textContent;
console.log("csvfilename is "+csvFileName);

let csvTableBody = document.querySelector('#csvtablebody');

let  _data; // data to store the csv data







// call the api to get a particular csv files  -----------------------------------------  
async function csvApiCall(){

  let url = `http://localhost:8150/api/csv/?csvname=${csvFileName}`;
   
    // calling api and checking   
    let response = await fetch(url);
      if (!response.ok) {
          console.log("response error");
          throw new Error(`HTTP error! status: ${response.status}`);
          
      }
    // fetching json from url response  
    const jsonData = await response.json();

    csvData = await jsonData._data; 

    _data=csvData;

    console.log("data is "+_data);

    let csvDatainarray = csvData.map(user => Object.values(user));

     console.log("csvData:-"+csvDatainarray);
         
     
}
// calling to get the files
csvApiCall();

// here text1= text done in filter and text2= column header ,from which you  want to filter
// filters the data corresponding 
async function filterInputCsv(text1,text2){

  let dataToFilter = _data;
  //let dataToFilter = _data.map(user => Object.values(user));


let filteredDataResult = await dataToFilter.filter(m => 
    m[text2].substring(0,text1.length).toLowerCase() === text1.toLowerCase());

return filteredDataResult;

}
// takes ouput of filterInput csv and display it 
async function giveSuggestion(text1,text2){


let filteredTextResult = await filterInputCsv(text1,text2);


displayCsv(filteredTextResult);



}

// handles display of data to table body
async function displayCsv(data){

  try{

    let length= await data.length;

      // refreshing mainpage
      csvTableBody.innerHTML=``;

      for( let smalldata of data){

        let tr = document.createElement('tr');
       

        for (let key in smalldata) {
          let td = document.createElement('td');
          td.innerText = smalldata[key]; // Accessing each property's value
          tr.appendChild(td);
        }
              

        csvTableBody.appendChild(tr);
      }


    }catch(err){
      console.log("minor error in displaycsvdata"+err);
    }
}


// this is the function called first when something is typed in filter
async function filterTable(columnName) {

 

   
    let input, inputText ;
    input = document.querySelector(`input[placeholder="Filter"][oninput="filterTable('${columnName}')"]`);
    
    inputText = input.value.toLowerCase();
    console.log("typed:-"+inputText);
    let callSuggestion = await
    giveSuggestion(inputText,columnName);  // filter and display

    
   

}


