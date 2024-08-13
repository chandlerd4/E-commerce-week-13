require('dotenv').config();
const { Sequelize } = require('sequelize');

const {
  DB_URL,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST = 'localhost',
  DB_DIALECT = 'postgres',
} = process.env;

const options = {
  dialect: DB_DIALECT,
  dialectOptions: {
    decimalNumbers: true,
  },
};

const sequelize = DB_URL
  ? new Sequelize(DB_URL, options)
  : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, { ...options, host: DB_HOST });

module.exports = sequelize;
