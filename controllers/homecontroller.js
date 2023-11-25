const express = require('express');
const multer = require('multer');





const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');


let uploadedFiles; // no use now

// ----------------Firebase -- Storage -----


const { Storage } = require('@google-cloud/storage');
const admin = require('../config/firebaseConfig');

const bucket = admin.storage().bucket();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });


 // -----------Start------homepage------------------

 module.exports.home = async function(req, res) {
  try {
    const folderPath = 'csv'; // Folder path within the storage bucket

    const [files] = await bucket.getFiles({ prefix: folderPath });

    const uploadedFiles = files.map(file => {
      return file.name.split('/').pop(); // Extracts the file name from the full path
    });

    return res.render('home', {
      title: 'CSVUploads',
      _para: 'Welcome to CSV file uploads',
      _Uploads: uploadedFiles,
    });
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    return res.status(500).send('Error fetching uploaded files');
  }
};



/*
 module.exports.home=async function(req,res){

  
    
   const uploadPath = path.join(__dirname, '../uploads/csv');

    uploadedFiles = fs.readdirSync(uploadPath);


    return res.render('home', { title: "CSVUploads",
                                 _para: "Welcome to CSV file uploads",
                                 _Uploads:uploadedFiles
                               });
}

*/



 
//------------------Multer --storage--------------------------

//  const defaultstorage = multer.diskStorage({

//    destination: (req, file, cb) => {
//      cb(null, 'uploads/csv'); // Store files in the "uploads/csv" directory
//    },

//    filename: (req, file, cb) => {

//     cb(null, file.originalname); // Use the original file name
//    },
//  });




// Managing uploading of csv files to firebase storage

module.exports.upload = async function (req, res) {

  upload.single('file')(req, res, function (err) {

    if (err) {
      console.log("fb"+err);
      return res.status(500).send(err.message);
     
    }

    if (!req.file) {
      console.log("fb !req.file ");
      return res.status(400).send('No file uploaded.');
    }
    const folderPath = 'csv'; // Name of the folder within the bucket

    const file = bucket.file(`${folderPath}/${req.file.originalname}`);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      },
      resumable: true // Enable resumable uploads for larger files
    });

    stream.on('error', (err) => {
      console.error('Error uploading to Firebase:', err);
      res.status(500).send('Upload to Firebase failed');
    });

    stream.on('finish', () => {
      console.log("File uploaded to Firebase successfully! ");
      res.status(200).send('File uploaded to Firebase successfully!');
    });

    stream.end(req.file.buffer);
  });
};


// ------------Detail page---------------------


module.exports.viewcsv = async function(req, res) {
  const fileName = req.params.fileName;

  console.log("filename:--" + fileName);

  try {
    const file = bucket.file(`csv/${fileName}`); // Path to your CSV file within the 'csv' folder

    const fileStream = file.createReadStream();
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




/*
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

*/


