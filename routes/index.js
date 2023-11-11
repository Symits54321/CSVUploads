
const express = require('express');
const router = express.Router();


 router.use('/',require('./home'));
 router.use('/api',require('./api/index'));
// router.use('/project',require('./project'));
// router.use('/issue',require('./issue'));

 //router.use('/api',require('./api/index'));

 // Use the homeController for handling file uploads



module.exports=router;