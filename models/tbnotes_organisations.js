/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbnotes_organisations', {
    noteid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organisationid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    adminid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    time_stamp: {
      type: Sequelize.DATE,
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'tbnotes_organisations'
  });
};
