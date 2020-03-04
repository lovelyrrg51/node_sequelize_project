/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbdatausage_monthly = sequelize.define('tbdatausage_monthly', {
    endpointid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    dt: {
      type: Sequelize.DATEONLY,
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
    tableName: 'tbdatausage_monthly',
    timestamps: false
  });

  tbdatausage_monthly.associate = function(models){
    tbdatausage_monthly.hasMany(models.tbsimcards, { foreignKey: 'endpointid' });
  } 

  return tbdatausage_monthly;
};
