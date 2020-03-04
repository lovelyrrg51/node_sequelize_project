/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbservice_profiles = sequelize.define('tbservice_profiles', {
    spid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    account_index: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    mbs_per_month: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'tbservice_profiles',
    timestamps: false
  });

  return tbservice_profiles;
};
