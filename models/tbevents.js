/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbevents = sequelize.define('tbevents', {
    eventid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    organisationid: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    account_index: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    time_stamp: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    },
    event_severity: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    event_source: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    simcardid: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    event_type: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    description_en: {
      type: Sequelize.STRING(1024),
      allowNull: true
    },
    description_ptbr: {
      type: Sequelize.STRING(1024),
      allowNull: true
    },
    description_es: {
      type: Sequelize.STRING(1024),
      allowNull: true
    },
    countryid: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    operatorid: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    rat: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    data_rx: {
      type: "DOUBLE",
      allowNull: true
    },
    data_tx: {
      type: "DOUBLE",
      allowNull: true
    },
    imei: {
      type: Sequelize.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'tbevents',
    timestamps: false
  });

  tbevents.associate = function(models){
    tbevents.belongsTo(models.tbcountries, { foreignKey: {name: 'countryid' }});
    tbevents.belongsTo(models.tboperators, { foreignKey: {name: 'operatorid' }});
  }
  return tbevents;
};
