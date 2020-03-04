/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbmonthly_summaries', {
    organisationid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    dt: {
      type: Sequelize.DATEONLY,
      allowNull: false
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
    cost: {
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
    surplus_gold: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    surplus_diamond: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    erp_bill_number: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    erp_bill_series: {
      type: Sequelize.STRING(32),
      allowNull: true
    },
    erp_error_code: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    erp_error_msg: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'tbmonthly_summaries',
    timestamps: false
  });
};
