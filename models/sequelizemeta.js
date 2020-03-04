/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('sequelizemeta', {
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'sequelizemeta'
  });
};
