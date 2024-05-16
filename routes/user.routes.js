/* eslint-disable no-undef */
const express = require('express');
const multer = require('multer');
const mqttClient = require('../services/mqttConfigs');

const router = express.Router(); // <-- Create a new router
const storage = multer.memoryStorage(); // menyimpan file ke memory
const upload = multer({ storage: storage });
const controller = require('../controllers/httpController');

//get data climate_1
// get one last data
router.get('/climate_1latest', controller.climate_1latest);
// get 50 last Data
router.get('/climate_1latest10', controller.climate_1latest10);
//get1daydata
router.get('/climate_1daily', controller.climate_1daily);
// // get7daysdata
router.get('/climate_1weekly', controller.climate_1weekly);
// // get30daysdata
router.get('/climate_1monthly', controller.climate_1monthly);

//get data climate_2
// get one last data
router.get('/climate_2latest', controller.climate_2latest);
// get 50 last Data
router.get('/climate_2latest10', controller.climate_2latest10);
//get1daydata
router.get('/climate_2daily', controller.climate_2daily);
// // get7daysdata
router.get('/climate_2weekly', controller.climate_2weekly);
// // get30daysdata
router.get('/climate_2monthly', controller.climate_2monthly);

// //get data NODE3
// // get one last data
// router.get('/node3_latest', controller.node3latest);
// // get 50 last Data
// router.get('/node3_latest10', controller.node3latest10);
// //get1daydata
// router.get('/node3_daily', controller.node3daily);
// // // get7daysdata
// router.get('/node3_weekly', controller.node3weekly);
// // // get30daysdata
// router.get('/node3_monthly', controller.node3monthly);

// //get data NODE4
// // get one last data
// router.get('/node4_latest', controller.node4latest);
// // get 50 last Data
// router.get('/node4_latest10', controller.node4latest10);
// //get1daydata
// router.get('/node4_daily', controller.node4daily);
// // // get7daysdata
// router.get('/node4_weekly', controller.node4weekly);
// // // get30daysdata
// router.get('/node4_monthly', controller.node4monthly);

// //get data NODE5
// // get one last data
// router.get('/node5_latest', controller.node5latest);
// // get 50 last Data
// router.get('/node5_latest10', controller.node5latest10);
// //get1daydata
// router.get('/node5_daily', controller.node5daily);
// // // get7daysdata
// router.get('/node5_weekly', controller.node5weekly);
// // // get30daysdata
// router.get('/node5_monthly', controller.node5monthly);

// //get data NODE6
// // get one last data
// router.get('/node6_latest', controller.node6latest);
// // get 50 last Data
// router.get('/node6_latest10', controller.node6latest10);
// //get1daydata
// router.get('/node6_daily', controller.node6daily);
// // // get7daysdata
// router.get('/node6_weekly', controller.node6weekly);
// // // get30daysdata
// router.get('/node6_monthly', controller.node6monthly);

// //get data NODE7
// // get one last data
// router.get('/node7_latest', controller.node7latest);
// // get 50 last Data
// router.get('/node7_latest10', controller.node7latest10);
// //get1daydata
// router.get('/node7_daily', controller.node7daily);
// // // get7daysdata
// router.get('/node7_weekly', controller.node7weekly);
// // // get30daysdata
// router.get('/node7_monthly', controller.node7monthly);

// //get data GATEWAY 
// // get one last data
// router.get('/gateway_latest', controller.gatewaylatest);
// // get 50 last Data
// router.get('/gateway_latest10', controller.gatewaylatest10);
// //get1daydata
// router.get('/gateway_daily', controller.gatewaydaily);
// // // get7daysdata
// router.get('/gateway_weekly', controller.gatewayweekly);
// // // get30daysdata
// router.get('/gateway_monthly', controller.gatewaymonthly);

// router.get('/soilmerge', controller.getCombinedData);


module.exports = router; 
