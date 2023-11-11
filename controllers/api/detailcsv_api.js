const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

module.exports.viewcsv = async function(req, res) {
  try {
    const fileName = req.query.csvname;
    const filePath = path.join(__dirname, '../../uploads/csv', fileName);

    const results = [];
    const fileStream = fs.createReadStream(filePath);

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


module.exports.uploads=async function(req,res){

  try {

   
  const uploadPath = path.join(__dirname, '../../uploads/csv');

   uploadedFiles = fs.readdirSync(uploadPath);

        return res.status(200).json({
          message: 'List of the CSV file',
          _data:uploadedFiles,
        });

  } catch (error) {
    console.error('Error showing CSV file in home:', error);
    res.status(500).send('Error showing CSV file in home');
  }
  
}
