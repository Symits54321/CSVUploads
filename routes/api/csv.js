const csvApi = require('../../controllers/api/detailcsv_api');

const express = require('express');
const router = express.Router();



 router.get('/',csvApi.viewcsv);
 router.get('/files',csvApi.uploads);
 


module.exports=router;