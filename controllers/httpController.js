const fs = require('fs');
const csvParser = require('csv-parser');
const moment = require('moment-timezone');
const fastcsv = require('fast-csv');
const path = require('path');
const { Sequelize } = require('sequelize');
/* eslint-disable no-undef */
const db = require('../models');  // Impor model
const stream = require('stream');
const client = require('../services/mqttConfigs');  // Impor klien MQTT dari file konfigurasi
const { response } = require('express');
const {Op} = require ('sequelize');


require('dotenv').config();

// definitiuon for databases
const climate_1 = db.climate_1;
const climate_2 = db.climate_2;


//CONTROLLER FOR NODE 1
exports.climate_1latest = (request, response) => {
        climate_1.findOne({
          order: [['id', 'DESC']],
        })
          .then((result) => {
            response.json(result);
          })
          .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
          });
      };

    exports.climate_1latest10 = (request, response) => {
        climate_1.findAll({
            limit: 10,
          order: [['id', 'DESC']],
        })
          .then((result) => {
            response.json(result);
          })
          .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
          });
      };

    exports.climate_1daily = (request, response) => {
      const currentDate = new Date();
      const startdate = new Date(currentDate);
      startdate.setDate(currentDate.getDate() - 1);
      const endDate = new Date(currentDate);

      climate_1.findAll({
        attributes: [
          [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '5 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 5)"), 'timestamp'],
          [Sequelize.fn('avg', Sequelize.col('temperature')), 'temperature'],
          [Sequelize.fn('avg', Sequelize.col('humidity')), 'humidity'],
          [Sequelize.fn('avg', Sequelize.col('rainfall')), 'rainfall'],
          [Sequelize.fn('avg', Sequelize.col('direction')), 'direction'],
          [Sequelize.fn('avg', Sequelize.col('angle')), 'angle'],
          [Sequelize.fn('avg', Sequelize.col('wind_speed')), 'wind_speed'],
        ],
        where: {
          createdAt: {
            [Op.between]: [startdate, endDate],
          },
        },
        group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '5 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 5)")],
        order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '5 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 5)"), 'DESC']],
      })
  
        .then((result) => {
          response.json(result);
        })
        .catch((error) => {
          console.error(error);
          response.status(500).json({ error: 'Internal server error' });
        });
    };

      exports.climate_1weekly = (request, response) => {
        const currentDate = new Date();
        const startdate = new Date(currentDate);
        startdate.setDate(currentDate.getDate() - 7);
        const endDate = new Date(currentDate);
      
        climate_1.findAll({
          attributes: [
            [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'timestamp'],
            [Sequelize.fn('avg', Sequelize.col('temperature')), 'temperature'],
            [Sequelize.fn('avg', Sequelize.col('humidity')), 'humidity'],
            [Sequelize.fn('avg', Sequelize.col('rainfall')), 'rainfall'],
            [Sequelize.fn('avg', Sequelize.col('direction')), 'direction'],
            [Sequelize.fn('avg', Sequelize.col('angle')), 'angle'],
            [Sequelize.fn('avg', Sequelize.col('wind_speed')), 'wind_speed'],
          ],
          where: {
            createdAt: {
              [Op.between]: [startdate, endDate],
            },
          },
          group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)")],
          order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'DESC']],
        })
    
          .then((result) => {
            response.json(result);
          })
          .catch((error) => {
            console.error(error);
            response.status(500).json({ error: 'Internal server error' });
          });
      };
      
      exports.climate_1monthly = (request, response) => {
        const currentDate = new Date();
        const startdate = new Date(currentDate);
        startdate.setDate(currentDate.getDate() - 30);
        const endDate = new Date(currentDate);
      
        climate_1.findAll({
          attributes: [
            [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'timestamp'],
            [Sequelize.fn('avg', Sequelize.col('temperature')), 'temperature'],
            [Sequelize.fn('avg', Sequelize.col('humidity')), 'humidity'],
            [Sequelize.fn('avg', Sequelize.col('rainfall')), 'rainfall'],
            [Sequelize.fn('avg', Sequelize.col('direction')), 'direction'],
            [Sequelize.fn('avg', Sequelize.col('angle')), 'angle'],
            [Sequelize.fn('avg', Sequelize.col('wind_speed')), 'wind_speed'],
      ],
          where: {
            createdAt: {
              [Op.between]: [startdate, endDate],
            },
          },
          group: [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt'))],
          order: [[Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'DESC']],
        })
          .then((result) => {
            response.json(result);
          })
          .catch((error) => {
            console.error(error);
            response.status(500).json({ error: 'Internal server error' });
          });
      };  

//CONTROLLER FOR NODE 2
exports.climate_2latest = (request, response) => {
  climate_2.findOne({
    order: [['id', 'DESC']],
  })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      response.status(500).json({ error: 'Internal server error' });
    });
};

exports.climate_2latest10 = (request, response) => {
  climate_2.findAll({
      limit: 10,
    order: [['id', 'DESC']],
  })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      response.status(500).json({ error: 'Internal server error' });
    });
};

exports.climate_2daily = (request, response) => {
const currentDate = new Date();
const startdate = new Date(currentDate);
startdate.setDate(currentDate.getDate() - 1);
const endDate = new Date(currentDate);

climate_2.findAll({
  attributes: [
    [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'timestamp'],
    [Sequelize.fn('avg', Sequelize.col('hum_dht22')), 'hum_dht22'],
    [Sequelize.fn('avg', Sequelize.col('temp_dht22')), 'temp_dht22'],
],
  where: {
    createdAt: {
      [Op.between]: [startdate, endDate],
    },
  },
  group: [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt'))],
  order: [[Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'DESC']],
})
  .then((result) => {
    response.json(result);
  })
  .catch((error) => {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  });
};

exports.climate_2weekly = (request, response) => {
  const currentDate = new Date();
  const startdate = new Date(currentDate);
  startdate.setDate(currentDate.getDate() - 7);
  const endDate = new Date(currentDate);

  climate_2.findAll({
    attributes: [
      [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'timestamp'],
      [Sequelize.fn('avg', Sequelize.col('hum_dht22')), 'hum_dht22'],
      [Sequelize.fn('avg', Sequelize.col('temp_dht22')), 'temp_dht22'],
    ],
    where: {
      createdAt: {
        [Op.between]: [startdate, endDate],
      },
    },
    group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)")],
    order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'DESC']],
  })

    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    });
};

exports.climate_2monthly = (request, response) => {
  const currentDate = new Date();
  const startdate = new Date(currentDate);
  startdate.setDate(currentDate.getDate() - 30);
  const endDate = new Date(currentDate);

  climate_2.findAll({
    attributes: [
      [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'timestamp'],
      [Sequelize.fn('avg', Sequelize.col('hum_dht22')), 'hum_dht22'],
      [Sequelize.fn('avg', Sequelize.col('temp_dht22')), 'temp_dht22'],
],
    where: {
      createdAt: {
        [Op.between]: [startdate, endDate],
      },
    },
    group: [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt'))],
    order: [[Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'DESC']],
  })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    });
}; 

//CONTROLLER FOR NODE 3
// exports.node3latest = (request, response) => {
//   node3.findOne({
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node3latest10 = (request, response) => {
//   node3.findAll({
//       limit: 10,
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node3daily = (request, response) => {
// const currentDate = new Date();
// const startdate = new Date(currentDate);
// startdate.setDate(currentDate.getDate() - 1);
// const endDate = new Date(currentDate);

// node3.findAll({
//   attributes: [
//     [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'ts'],
//     [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//     [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//     [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//     [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//   where: {
//     createdAt: {
//       [Op.between]: [startdate, endDate],
//     },
//   },
//   group: [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt'))],
//   order: [[Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'DESC']],
// })
//   .then((result) => {
//     response.json(result);
//   })
//   .catch((error) => {
//     console.error(error);
//     response.status(500).json({ error: 'Internal server error' });
//   });
// };

// exports.node3weekly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 7);
//   const endDate = new Date(currentDate);

//   node3.findAll({
//     attributes: [
//       [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
//     ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)")],
//     order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'DESC']],
//   })

//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node3monthly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 30);
//   const endDate = new Date(currentDate);

//   node3.findAll({
//     attributes: [
//       [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt'))],
//     order: [[Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// }; 

// //CONTROLLER FOR NODE 4
// exports.node4latest = (request, response) => {
//   node4.findOne({
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node4latest10 = (request, response) => {
//   node4.findAll({
//       limit: 10,
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node4daily = (request, response) => {
// const currentDate = new Date();
// const startdate = new Date(currentDate);
// startdate.setDate(currentDate.getDate() - 1);
// const endDate = new Date(currentDate);

// node4.findAll({
//   attributes: [
//     [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'ts'],
//     [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//     [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//     [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//     [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//   where: {
//     createdAt: {
//       [Op.between]: [startdate, endDate],
//     },
//   },
//   group: [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt'))],
//   order: [[Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'DESC']],
// })
//   .then((result) => {
//     response.json(result);
//   })
//   .catch((error) => {
//     console.error(error);
//     response.status(500).json({ error: 'Internal server error' });
//   });
// };

// exports.node4weekly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 7);
//   const endDate = new Date(currentDate);

//   node4.findAll({
//     attributes: [
//       [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
//     ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)")],
//     order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'DESC']],
//   })

//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node4monthly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 30);
//   const endDate = new Date(currentDate);

//   node4.findAll({
//     attributes: [
//       [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt'))],
//     order: [[Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// }; 


// //CONTROLLER FOR NODE 5
// exports.node5latest = (request, response) => {
//   node5.findOne({
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node5latest10 = (request, response) => {
//   node5.findAll({
//       limit: 10,
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node5daily = (request, response) => {
// const currentDate = new Date();
// const startdate = new Date(currentDate);
// startdate.setDate(currentDate.getDate() - 1);
// const endDate = new Date(currentDate);

// node5.findAll({
//   attributes: [
//     [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'ts'],
//     [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//     [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//     [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//     [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//   where: {
//     createdAt: {
//       [Op.between]: [startdate, endDate],
//     },
//   },
//   group: [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt'))],
//   order: [[Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'DESC']],
// })
//   .then((result) => {
//     response.json(result);
//   })
//   .catch((error) => {
//     console.error(error);
//     response.status(500).json({ error: 'Internal server error' });
//   });
// };

// exports.node5weekly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 7);
//   const endDate = new Date(currentDate);

//   node5.findAll({
//     attributes: [
//       [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
//     ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)")],
//     order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'DESC']],
//   })

//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node5monthly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 30);
//   const endDate = new Date(currentDate);

//   node5.findAll({
//     attributes: [
//       [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt'))],
//     order: [[Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// }; 

// //CONTROLLER FOR NODE 6
// exports.node6latest = (request, response) => {
//   node6.findOne({
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node6latest10 = (request, response) => {
//   node6.findAll({
//       limit: 10,
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node6daily = (request, response) => {
// const currentDate = new Date();
// const startdate = new Date(currentDate);
// startdate.setDate(currentDate.getDate() - 1);
// const endDate = new Date(currentDate);

// node6.findAll({
//   attributes: [
//     [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'ts'],
//     [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//     [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//     [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//     [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//   where: {
//     createdAt: {
//       [Op.between]: [startdate, endDate],
//     },
//   },
//   group: [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt'))],
//   order: [[Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'DESC']],
// })
//   .then((result) => {
//     response.json(result);
//   })
//   .catch((error) => {
//     console.error(error);
//     response.status(500).json({ error: 'Internal server error' });
//   });
// };

// exports.node6weekly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 7);
//   const endDate = new Date(currentDate);

//   node6.findAll({
//     attributes: [
//       [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
//     ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)")],
//     order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'DESC']],
//   })

//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node6monthly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 30);
//   const endDate = new Date(currentDate);

//   node6.findAll({
//     attributes: [
//       [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt'))],
//     order: [[Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// }; 

// //CONTROLLER FOR NODE 7
// exports.node7latest = (request, response) => {
//   node7.findOne({
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node7latest10 = (request, response) => {
//   node7.findAll({
//       limit: 10,
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node7daily = (request, response) => {
// const currentDate = new Date();
// const startdate = new Date(currentDate);
// startdate.setDate(currentDate.getDate() - 1);
// const endDate = new Date(currentDate);

// node7.findAll({
//   attributes: [
//     [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'ts'],
//     [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//     [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//     [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//     [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//   where: {
//     createdAt: {
//       [Op.between]: [startdate, endDate],
//     },
//   },
//   group: [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt'))],
//   order: [[Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'DESC']],
// })
//   .then((result) => {
//     response.json(result);
//   })
//   .catch((error) => {
//     console.error(error);
//     response.status(500).json({ error: 'Internal server error' });
//   });
// };

// exports.node7weekly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 7);
//   const endDate = new Date(currentDate);

//   node7.findAll({
//     attributes: [
//       [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
//     ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)")],
//     order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'DESC']],
//   })

//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.node7monthly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 30);
//   const endDate = new Date(currentDate);

//   node7.findAll({
//     attributes: [
//       [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//       [Sequelize.fn('avg', Sequelize.col('soilmoisture')), 'SoilMoisture'],
// ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt'))],
//     order: [[Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// }; 


// //CONTROLLER FOR GATEWAY
// exports.gatewaylatest = (request, response) => {
//   gateway.findOne({
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.gatewaylatest10 = (request, response) => {
//   gateway.findAll({
//       limit: 10,
//     order: [['id', 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.gatewaydaily = (request, response) => {
// const currentDate = new Date();
// const startdate = new Date(currentDate);
// startdate.setDate(currentDate.getDate() - 1);
// const endDate = new Date(currentDate);

// gateway.findAll({
//   attributes: [
//     [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'ts'],
//     [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//     [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//     [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
// ],
//   where: {
//     createdAt: {
//       [Op.between]: [startdate, endDate],
//     },
//   },
//   group: [Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt'))],
//   order: [[Sequelize.fn('date_trunc', 'minute', Sequelize.col('createdAt')), 'DESC']],
// })
//   .then((result) => {
//     response.json(result);
//   })
//   .catch((error) => {
//     console.error(error);
//     response.status(500).json({ error: 'Internal server error' });
//   });
// };

// exports.gatewayweekly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 7);
//   const endDate = new Date(currentDate);

//   gateway.findAll({
//     attributes: [
//       [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
//     ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)")],
//     order: [[Sequelize.literal("date_trunc('hour', \"createdAt\") + INTERVAL '30 minutes' * FLOOR(EXTRACT(MINUTE FROM \"createdAt\") / 30)"), 'DESC']],
//   })

//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// };

// exports.gatewaymonthly = (request, response) => {
//   const currentDate = new Date();
//   const startdate = new Date(currentDate);
//   startdate.setDate(currentDate.getDate() - 30);
//   const endDate = new Date(currentDate);

//   gateway.findAll({
//     attributes: [
//       [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'ts'],
//       [Sequelize.fn('avg', Sequelize.col('current')), 'Current'],
//       [Sequelize.fn('avg', Sequelize.col('voltage')), 'Voltage'],
//       [Sequelize.fn('avg', Sequelize.col('temperature')), 'Temperature'],
// ],
//     where: {
//       createdAt: {
//         [Op.between]: [startdate, endDate],
//       },
//     },
//     group: [Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt'))],
//     order: [[Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')), 'DESC']],
//   })
//     .then((result) => {
//       response.json(result);
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).json({ error: 'Internal server error' });
//     });
// }; 


// exports.getCombinedData = async (req, res) => {
//   try {
//     // Query untuk masing-masing tabel
//     const dataFromTable1 = await climate_1.findAll({ attributes: [['soilmoisture', 'soilmoisture1']], limit: 10, order: [['ts', 'DESC']] });
//     const dataFromTable2 = await climate_2.findAll({ attributes: [['soilmoisture', 'soilmoisture2']], limit: 10, order: [['ts', 'DESC']] });
//     const dataFromTable3 = await node3.findAll({ attributes: [['soilmoisture', 'soilmoisture3']], limit: 10, order: [['ts', 'DESC']] });
//     const dataFromTable4 = await node4.findAll({ attributes: [['soilmoisture', 'soilmoisture4']], limit: 10, order: [['ts', 'DESC']] });
//     const dataFromTable5 = await node5.findAll({ attributes: [['soilmoisture', 'soilmoisture5']], limit: 10, order: [['ts', 'DESC']] });
//     const dataFromTable6 = await node6.findAll({ attributes: [['soilmoisture', 'soilmoisture6']], limit: 10, order: [['ts', 'DESC']] });
//     const dataFromTable7 = await node7.findAll({ attributes: [['soilmoisture', 'soilmoisture7']], limit: 10, order: [['ts', 'DESC']] });
//     // ... Lanjutkan untuk tabel 4 hingga 7

//     let combinedData = [];

//     for (let i = 0; i < 10; i++) {
//       let combinedEntry = {};

//       if (dataFromTable1[i]) combinedEntry.soilmoisture1 = dataFromTable1[i].dataValues.soilmoisture1;
//       if (dataFromTable2[i]) combinedEntry.soilmoisture2 = dataFromTable2[i].dataValues.soilmoisture2;
//       if (dataFromTable3[i]) combinedEntry.soilmoisture3 = dataFromTable3[i].dataValues.soilmoisture3;
//       if (dataFromTable4[i]) combinedEntry.soilmoisture4 = dataFromTable4[i].dataValues.soilmoisture4;
//       if (dataFromTable5[i]) combinedEntry.soilmoisture5 = dataFromTable5[i].dataValues.soilmoisture5;
//       if (dataFromTable6[i]) combinedEntry.soilmoisture6 = dataFromTable6[i].dataValues.soilmoisture6;
//       if (dataFromTable7[i]) combinedEntry.soilmoisture7 = dataFromTable7[i].dataValues.soilmoisture7;
      

//       // ... Lanjutkan dengan cara yang sama untuk tabel 4 hingga 7

//       combinedData.push(combinedEntry);
//     }

//     res.json(combinedData);
//   } catch (error) {
//     res.status(500).send({ error: 'Internal server error' });
//   }
// };