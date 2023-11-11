let uploadbtn = document.getElementById('uploadLink');
let dropArea = document.getElementById('dropArea');
let fileInput = document.getElementById('csvFileInput');
let searchBox = document.querySelector('.searchbox');
let listbox = document.querySelector('#csvlist');

let csvDataFiles;

// when dropdown btn is clicked then fileInput is also clicked (which is in hidden form)
uploadbtn.addEventListener('click', function() {
    fileInput.click();
});




// When a file is selected using the file input
fileInput.addEventListener('change', function() {
    const file = this.files[0];

    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
        // Create a new FormData object and append the file
        const formData = new FormData();
        formData.append('csvFile', file);

        // Use XMLHttpRequest for the file upload
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                window.location.reload();
                console.log('File uploaded successfully');
            } else {
                console.error('Error:', xhr.statusText);
            }
        };

        xhr.onerror = function() {
            console.error('Network error');
        };

        // Send the FormData object
        xhr.send(formData);
    }else{
        console.log("Its Not csv file , not uploaded");
    }
});


// when dropping file in dropArea
dropArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropArea.classList.add('dragover');  
});

dropArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', function(e) {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    
    // if file then make form data and append in it and then upload
    if (file  && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {                      
        const formData = new FormData();
        formData.append('csvFile', file);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            console.log( "Form data :- "+data); // You can handle the server response here
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }else{
        console.log("Its Not csv file , not uploaded");
    }
});





async function allCsvApiCall(){

    let url = `http://localhost:8150/api/csv/files`;
     
      // calling api and checking   
      let response = await fetch(url);
        if (!response.ok) {
            console.log("response error");
            throw new Error(`HTTP error! status: ${response.status}`);
            
        }
      // fetching json from url response  
      const jsonData = await response.json();
  
      csvDataFiles = await jsonData._data; 
  
      console.log("All csv are "+ csvDataFiles);
  
           
       
  }
  
  allCsvApiCall();






async function filterInputCsv(text){

    let dataToFilter = csvDataFiles;
    //let dataToFilter = _data.map(user => Object.values(user));
  
  
  let filteredDataResult = await dataToFilter.filter(m => 
      m.substring(0,text.length).toLowerCase() === text.toLowerCase());
  
  return filteredDataResult;
  
  }
  
  async function giveSuggestion(text){
  
  
  let filteredTextResult = await filterInputCsv(text);
  
  displayCsvList(filteredTextResult);
  
  
  
  }
  
  
  async function displayCsvList(data){
  
    try{
  
      let length= await data.length;
  
        // refreshing mainpage
       listbox.innerHTML=``;

       listbox.innerHTML=`

       <div><p>Your Uploads</p></div>


       `;
  
        for( let smalldata of data){
  
          let li = document.createElement('LI');
         
  
             li.innerHTML=`
     
             <p></p><a href="/viewCSV/${smalldata}">${smalldata}</a>
             
             `;


          listbox.appendChild(li);
        }
  
  
      }catch(err){
        console.log("minor error in displaycsvdata"+err);
      }
  }
  
  



// Event listener function for search input
if(searchBox){
    searchBox.addEventListener('keyup', async (e) => {
    
        let inputText = e.target.value;
    
        if(inputText){
            let abstractCallToFilterAndDisplay = await
            giveSuggestion(inputText);
        }else{
            displayCsvList(csvDataFiles);
        }
       
    });
}