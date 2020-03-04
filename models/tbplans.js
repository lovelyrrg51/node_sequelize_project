/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbplans = sequelize.define('tbplans', {
    planid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    readjustment_date: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    account_index: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    mbs_per_month: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'tbplans'
  });

  tbplans.associate = function(models){
//    tbplans.belongsTo(models.tbcosts, { foreignKey: {name: 'planid' }});
    tbplans.hasMany(models.tbsimcards, { foreignKey: 'planid' });

    tbplans.belongsToMany(models.tbcurrencies, {
      through: 'tbcosts',
      foreignKey: 'planid',
      otherKey: 'currencyid',
      constraints: false
    });
  }

  return tbplans;
};
