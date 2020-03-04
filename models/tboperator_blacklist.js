/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tboperator_blacklist = sequelize.define('tboperator_blacklist', {
    blacklistid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    endpointid: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    operatorid: {
      type: Sequelize.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'tboperator_blacklist',
    timestamps: false
  });

  tboperator_blacklist.associate = function(models){
    tboperator_blacklist.belongsTo(models.tboperators, { foreignKey: 'operatorid' });
  }
  return tboperator_blacklist
};
