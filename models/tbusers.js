/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbusers = sequelize.define('tbusers', {
    userid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organisationid: {
     type: Sequelize.INTEGER(11),
     allowNull: false
    },
    enabled: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    receive_notifications: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    receive_monthly_reports: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    name: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(128),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    deleted: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    timestamps: false,
    tableName: 'tbusers'
  });

  tbusers.associate = function(models){
    tbusers.belongsTo(models.tborganisations, { foreignKey: { name: 'organisationid' }});
    tbusers.hasMany(models.tblogs, { foreignKey: { name: 'userid' }});
//    tbusers.belongsTo(models.tblogs, { foreignKey: { name: 'userid' }});
//    tbusers.belongsTo(models.tborganisations);
  }

  return tbusers;
};
