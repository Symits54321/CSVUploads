const express = require('express');
const router = express.Router();

const homecontroller = require('../controllers/homecontroller');

 router.get('/',homecontroller.home);
 router.post('/upload',homecontroller.upload );
 router.get('/viewCSV/:fileName',homecontroller.viewcsv);

// router.use('/comment',require('./comment'));

module.exports=router;   