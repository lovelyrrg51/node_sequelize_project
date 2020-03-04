/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbadmins', {
    adminid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    enabled: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    type: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    admin_profile: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    tech_profile: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
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
    tableName: 'tbadmins'
  });
};
