/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbserver', {
    last_closed_month: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    last_prepaid_processing_date: {
      type: Sequelize.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'tbserver'
  });
};
