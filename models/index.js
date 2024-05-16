/* eslint-disable no-undef */
const { Sequelize, Op } = require('sequelize');
//  const carbon_config = require('../configs/dataCarbon.config');
require('dotenv').config();

const climate_sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOSTS,
    dialect: process.env.DIALECT,
    logging: false,
  },
);

const db = {};
db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = climate_sequelize;
db.climate_1 = require('./climate_1')(climate_sequelize, Sequelize);
db.climate_2 = require('./climate_2')(climate_sequelize, Sequelize);

module.exports = db;
