let uploadbtn = document.getElementById('uploadLink');
let dropArea = document.getElementById('dropArea');
let fileInput = document.getElementById('csvFileInput');
let searchBox = document.querySelector('.searchbox');
let listbox = document.querySelector('#csvlist');
let notice = document.querySelector('#notice');

let csvDataFiles;

// when Upload btn is clicked then fileInput(hidden) is also clicked
uploadbtn.addEventListener('click', function() {
    fileInput.click();
});




// When a file is selected and open btn is clicked 
fileInput.addEventListener('change', function() {
    const file = this.files[0];

    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
        // Create a new FormData object and append the file
      
        const formData = new FormData();
        formData.append('file', file);

        // Use XMLHttpRequest for the file upload
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                RefreshPage();
                fileUploadFlashing();
                console.log('File uploaded successfully');
            } else {
                console.error('Error:', xhr.statusText);
                fileErrorFlashing();
            }
        };

        xhr.onerror = function() {
            console.error('Network error');
        };

        // Send the FormData object
        xhr.send(formData);
    }else{
        fileErrorFlashing();
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
    //if (file  && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {                      
        if (file  && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {                      
    
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            console.log( "Form data :- "+data); // You can handle the server response here
               RefreshPage();
                fileUploadFlashing();
                console.log('File uploaded successfully');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }else{
        fileErrorFlashing();
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
  
  
  async function fileUploadFlashing(){
          
    notice.textContent="File Uploaded Succesfully";
    notice.style.boxShadow = '0px 0px 25px 20px lightgoldenrodyellow';
    notice.style.animation = "flashing 7600ms linear";
   setTimeout(FlashingNone,7750) ;

  }

  async function FlashingNone(){
    notice.style.animation = "none";
  }

  async function fileErrorFlashing(){
    notice.textContent="Uploading Failed";
    notice.style.boxShadow = '0px 0px 25px 20px red';
    notice.style.animation = "flashing 7600ms linear";
    setTimeout(FlashingNone,7750) ;

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

async function RefreshPage() {
    setTimeout(async () => {
        try {
            await allCsvApiCall();
            displayCsvList(csvDataFiles);
        } catch (error) {
            console.error('Error refreshing page:', error);
        }
    }, 300); // Changed 1000s to 1000 (milliseconds)
}