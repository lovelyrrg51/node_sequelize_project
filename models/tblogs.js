/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tblogs = sequelize.define('tblogs', {
    logid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    operationid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    organisationid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    userid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    time_stamp: {
      type: Sequelize.DATE,
      allowNull: false
    },
    param1: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    param2: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    param3: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tblogs',
    timestamps: false
  });

  tblogs.associate = function(models){
//    tblogs.hasMany(models.tbusers, { foreignKey: { name: 'userid'} });
    tblogs.belongsTo(models.tbusers, { foreignKey: { name: 'userid'} });
    tblogs.belongsTo(models.tborganisations, { foreignKey: { name: 'organisationid'} });
    //tborganisations.belongsTo(models.tbcurrencies);
  };

  return tblogs;
};
