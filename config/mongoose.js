// library
const mongoose = require("mongoose");

//connecting
main().catch(err => console.log("database err"+err));
async function main(){
    await mongoose.connect ('mongodb+srv://sumitsingh3357:NCWVCTc2Lz5DL581@cluster0.obuakmx.mongodb.net/?retryWrites=true&w=majority')
}

 // connect to DB
const db = mongoose.connection;

//error
db.on('error',console.error.bind(console,'error connecting to db'));
 
// up and running then print the message
db.once('open',function(){
  console.log('Succesfully connected to the MongoDB database')
});

