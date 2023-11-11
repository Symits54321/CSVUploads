const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

let uploadedFiles;

 // -----------Start------homepage------------------

 module.exports.home=async function(req,res){

  
    
   const uploadPath = path.join(__dirname, '../uploads/csv');

    uploadedFiles = fs.readdirSync(uploadPath);


    return res.render('home', { title: "CSVUploads",
                                 _para: "Welcome to CSV file uploads",
                                 _Uploads:uploadedFiles
                               });
}
 
//------------------Multer ----------------------------

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/csv/'); // Store files in the "uploads/csv" directory
  },

  filename: (req, file, cb) => {

    cb(null, file.originalname); // Use the original file name
  },
});

// Define a function to filter the file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true); // Accept CSV files
  } else {
    cb(new Error('Only CSV files are allowed'), false); // Reject other file types
    console.log("Not csv file");
    
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('csvFile');


//--------- Uploads --------------------

module.exports.upload = async function(req,res){

       
      upload(req, res, (err) => {

        if (err) {
         
            //  res.redirect('back');
          return res.status(500).send(err.message);
          
        }

        res.send('File uploaded successfully');
        
      });



}

//
module.exports.viewcsv = async function(req, res) {
  const fileName = req.params.fileName;

  console.log("filename:--" + fileName);

  const filePath = path.join(__dirname, '../uploads/csv', fileName);

  try {
    const fileStream = fs.createReadStream(filePath);
    let parsedData = []; // To store all rows

    Papa.parse(fileStream, {
      header: true, // Assuming the first row contains headers
      dynamicTyping: true, // Parse numeric values as numbers, not strings
      skipEmptyLines: true, // Skip empty lines
      step: (row) => {
        parsedData.push(row.data); // Store each row
      },
      complete: () => {
        res.render('csvdetail', {
          _fileName: fileName,
          _data: parsedData, // Pass all rows to the view
        });
      },
      error: (error) => {
        console.error('Error parsing CSV file:', error);
        res.status(500).send('Error parsing CSV file');
      },
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).send('Error reading CSV file');
  }
};
