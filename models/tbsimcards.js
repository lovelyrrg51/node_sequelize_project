/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbsimcards = sequelize.define('tbsimcards', {
    simcardid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(128),
      allowNull: true
    },
    iccid: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    pin: {
      type: Sequelize.STRING(6),
      allowNull: true
    },
    imsi: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    msisdn: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    model: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    form_factor: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    produced: {
      type: Sequelize.DATE,
      allowNull: true
    },
    organisationid: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    planid: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    spid: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    status: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    prev_status: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    activation_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    connectivity_status: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '2'
    },
    endpointid: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'tbdatausage_monthly', 
        key: 'endpointid'
      }
    },
    imei: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    imei_locked: {
      type: Sequelize.INTEGER(1),
      allowNull: true
    },
    rat: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    operatorid: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    pdp_context_activation: {
      type: Sequelize.DATE,
      allowNull: true
    },
    pdp_context_duration: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    conn_last_1d: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    conn_last_7d: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    conn_last_30d: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    ipaddress: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    rx: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    tx: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    total: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    cost: {
      type: "DOUBLE",
      allowNull: false,
      defaultValue: '0'
    },
    mcc: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    mnc: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    lac: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    cid: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    latitude: {
      type: "DOUBLE",
      allowNull: true
    },
    longitude: {
      type: "DOUBLE",
      allowNull: true
    },
    last_geolocation_request: {
      type: Sequelize.DATE,
      allowNull: true
    },
    alert_80perc_plan: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    alert_100perc_plan: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    alert_blocked_traffic_exceeded: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    pending_data: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    reset_connection: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
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
    activation_deadline: {
      type: Sequelize.DATE,
      allowNull: true
    },
    surveillance: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'tbsimcards',
    timestamps: false
  });

  tbsimcards.associate = function(models){
    tbsimcards.belongsTo(models.tbplans, { foreignKey: 'planid' });
    tbsimcards.belongsTo(models.tborganisations, { foreignKey: 'organisationid' });
    tbsimcards.belongsTo(models.tbdatausage_monthly, { foreignKey: 'endpointid'});
//    tbsimcards.belongsTo(models.tboperators, { foreignKey: 'operatorid'});
    tbsimcards.belongsToMany(models.tboperators, {
      through: 'tbconnections_stats',
      foreignKey: 'simcardid',
      otherKey: 'operatorid',
      constraints: false
    });
  } 

  return tbsimcards;
};
