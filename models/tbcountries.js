/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbcountries = sequelize.define('tbcountries', {
    countryid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(256),
      allowNull: true
    },
    country_code: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    iso_code: {
      type: Sequelize.STRING(3),
      allowNull: true
    },
    mcc: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    latitude: {
      type: "DOUBLE",
      allowNull: true
    },
    longitude: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'tbcountries',
    timestamps: false
  });

  tbcountries.associate = function(models){
    tbcountries.hasMany(models.tboperators, { foreignKey: 'countryid' });
    tbcountries.hasMany(models.tbevents, { foreignKey: 'countryid' }); 
  } 
  return tbcountries;
};
