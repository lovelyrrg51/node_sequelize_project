/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbnotes_simcards', {
    noteid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    simcardid: {
      type: Sequelize.BIGINT,
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
    tableName: 'tbnotes_simcards'
  });
};
