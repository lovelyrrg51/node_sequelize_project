/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbconnections_stats = sequelize.define('tbconnections_stats', {
    simcardid: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    periodicity: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    operatorid: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    numconnections: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'tbconnections_stats',
    timestamps: false
  });

  tbconnections_stats.associate = function(models){
    tbconnections_stats.belongsTo(models.tboperators, {foreignKey: 'operatorid', targetKey: 'operatorid'});
    tbconnections_stats.belongsTo(models.tbsimcards, {foreignKey: 'simcardid', targetKey: 'simcardid'});
  }
  
  return tbconnections_stats;
};
