const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
//const serviceAccount = require('../routes/cred/csvuploadbysumit-firebase-adminsdk-u2oqg-192f533358.json'); // Path to your Firebase service account key JSON file
const serviceAccount =JSON.parse(process.env.SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'csvuploadbysumit.appspot.com/' // Replace with your Firebase Storage Bucket URL
});

module.exports=admin;



// consoling succesfull connection

admin.app().storage().bucket().getFiles() // Access any storage method to check the connection
  .then(() => {
    console.log('Succesfully connected to the Firebase Storage bucket');
  })
  .catch(error => {
    console.error('Firebase connection error:', error);
  });