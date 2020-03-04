/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbstates', {
    stateid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    countryid: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    abbreviation: {
      type: Sequelize.STRING(16),
      allowNull: true
    }
  }, {
    tableName: 'tbstates'
  });
};
