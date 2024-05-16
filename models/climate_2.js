module.exports = (sequelize, Sequelize) => {
    const climate_2= sequelize.define('climate_2', {
        timestamp: {
            type: Sequelize.DATE,
          },
          hum_dht22: {
            type: Sequelize.FLOAT,
          },
          temp_dht22: {
            type: Sequelize.FLOAT,
          },
        });
    return climate_2;
  };
  