/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbstockinout', {
    stockinoutid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    operation_type: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    time_stamp: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    },
    orderid: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    organisationid: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    qty: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    planid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    iccid_list: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'tbstockinout'
  });
};
