/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tboperators = sequelize.define('tboperators', {
    operatorid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    countryid: {
      type: Sequelize.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'tboperators',
    timestamps: false
  });

  tboperators.associate = function(models){
    tboperators.belongsTo(models.tbcountries, { foreignKey: 'countryid' });
    tboperators.belongsToMany(models.tbsimcards, {
      through: 'tbconnections_stats',
      foreignKey: 'operatorid',
      otherKey: 'simcardid',
      constraints: false
    });
    tboperators.hasMany(models.tbevents, { foreignKey: 'operatorid' });
    tboperators.hasMany(models.tboperator_blacklist, { foreignKey: 'operatorid'});
 //    tboperators.hasMany(models.tbsimcards, { foreignKey: 'operatorid' });
//    tboperators.hasMany(models.tbconnections_stats, { foreignKey: 'operatorid' });
  } 
  return tboperators;
};
