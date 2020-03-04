/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbdatausage_daily', {
    endpointid: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    dt: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    rx: {
      type: "DOUBLE",
      allowNull: false
    },
    tx: {
      type: "DOUBLE",
      allowNull: false
    },
    total: {
      type: "DOUBLE",
      allowNull: false
    }
  }, {
    tableName: 'tbdatausage_daily'
  });
};
