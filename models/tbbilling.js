/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbbilling', {
    dt: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    total_simcards_gold: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    total_simcards_diamond: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    active_simcards_gold: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    active_simcards_diamond: {
      type: Sequelize.INTEGER(11),
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
    },
    cost_usd: {
      type: "DOUBLE",
      allowNull: false
    },
    cost_brl: {
      type: "DOUBLE",
      allowNull: false
    },
    xls_report: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    pdf_report: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    zipped_monthly_reports: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    surplus_gold: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    surplus_diamond: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'tbbilling'
  });
};
