/* eslint-disable no-undef */
// Memanggil kedua fungsi
require('../services/mqttConfigs');
require('../controllers/mqttController');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../models');
const mqttClient = require('../services/mqttConfigs')
const multer = require('multer');
const storage = multer.memoryStorage(); // menyimpan file ke memory
const upload = multer({ storage: storage });

const route = require('../routes/user.routes')

// const route = require('./routes/user.routes');

const app = express();
const corsOptions = {
  origin: '*',
};

// apply the CORS options
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());


// if you run again and don't wanna lost your data
db.sequelize.sync();

// medium route
 app.use('/api', route);

// middleware setting for public directory
 app.use(express.static('public'));

// set port, listen for requests
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}.`);
});
