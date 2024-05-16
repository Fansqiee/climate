module.exports = (sequelize, Sequelize) => {
  const climate_1 = sequelize.define('climate_1', {
    timestamp: {
      type: Sequelize.DATE,
    },
    temperature: {
      type: Sequelize.FLOAT,
    },
    humidity: {
      type: Sequelize.FLOAT,
    },
    rainfall: {
      type: Sequelize.FLOAT,
    },
    direction: {
      type: Sequelize.FLOAT,
    },
    angle: {
      type: Sequelize.FLOAT,
    },
    wind_speed: {
      type: Sequelize.FLOAT,
    },
  });
  return climate_1;
};
