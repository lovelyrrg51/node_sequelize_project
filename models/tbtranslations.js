/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tbtranslations', {
    translationid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    en: {
      type: Sequelize.STRING(512),
      allowNull: false
    },
    ptbr: {
      type: Sequelize.STRING(512),
      allowNull: true
    },
    es: {
      type: Sequelize.STRING(512),
      allowNull: true
    }
  }, {
    tableName: 'tbtranslations'
  });
};
