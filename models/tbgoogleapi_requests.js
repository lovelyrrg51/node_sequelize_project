/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbgoogleapi_requests', {
    requestid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    simcardid: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    dt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    }
  }, {
    tableName: 'tbgoogleapi_requests'
  });
};
