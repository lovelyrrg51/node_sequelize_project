'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
/*
db.tbusers = require('../models/tbusers.js')(sequelize);
db.tborganisations = require('../models/tborganisations')(sequelize);
db.tbcurrencies = require('../models/tbcurrencies')(sequelize);

db.tbusers.belongsTo(db.tborganisations);
db.tborganisations.hasMany(db.tbusers, { foreignKey: {name: 'organisationid', allowNull: false} });
//db.tborganisations.hasMany(db.tbusers);
db.tborganisations.belongsTo(db.tbcurrencies);
//db.tbcurrencies.hasMany(db.tborganisations);
db.tbcurrencies.hasMany(db.tborganisations, { foreignKey: {name: 'currencyid', allowNull: false} });*/

module.exports = db;
