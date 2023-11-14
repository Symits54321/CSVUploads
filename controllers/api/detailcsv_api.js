//---**-- This API is generally used while filtering data so that javascript can communicate with it.



const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

// ----------------Firebase -- Storage -----

const { Storage } = require('@google-cloud/storage');
const admin = require('../../config/firebaseConfig');
/*
const serviceAccount = require('../../routes/cred/csvuploadbysumit-firebase-adminsdk-u2oqg-192f533358.json'); // Path to your Firebase service account key JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'csvuploadbysumit.appspot.com/' // Replace with your Firebase Storage Bucket URL
});
*/
const bucket = admin.storage().bucket();



// ------ Detail csv page (Api used for filtering data)
module.exports.viewcsv = async function(req, res) {
  try {
    /*
    const fileName = req.query.csvname;
    const filePath = path.join(__dirname, '../../uploads/csv', fileName);

    const results = [];
    const fileStream = fs.createReadStream(filePath);
  */
    const fileName = req.query.csvname;
    const file = bucket.file(`csv/${fileName}`); // Path to your CSV file within the 'csv' folder

    const results = [];
    const fileStream = file.createReadStream();


    Papa.parse(fileStream, {
      header: true, // Assumes the first row is a header row
      complete: (parsedData) => {
        results.push(parsedData.data);

        return res.status(200).json({
          message: 'Data of the CSV file',
          _data: parsedData.data,
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

// It shows the files uploaded 
module.exports.uploads=async function(req,res){

  try {

  /* 
  const uploadPath = path.join(__dirname, '../../uploads/csv');

   uploadedFiles = fs.readdirSync(uploadPath);
   */

   const folderPath = 'csv'; // Folder path within the storage bucket

   const [files] = await bucket.getFiles({ prefix: folderPath });

   const uploadedFiles = files.map(file => {
     return file.name.split('/').pop(); // Extracts the file name from the full path
   });

        return res.status(200).json({
          message: 'List of the CSV file',
          _data:uploadedFiles,
        });

  } catch (error) {
    console.error('Error showing CSV file in home:', error);
    res.status(500).send('Error showing CSV file in home');
  }
  
}
