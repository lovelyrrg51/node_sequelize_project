/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbalerts', {
    alertid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    simcardid: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    alert_type: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    occurred_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    occurred_time: {
      type: Sequelize.TIME,
      allowNull: false
    },
    notified: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tbalerts'
  });
};
