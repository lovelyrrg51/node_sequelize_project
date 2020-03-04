/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbcurriences = sequelize.define('tbcurrencies', {
    currencyid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    iso_code: {
      type: Sequelize.STRING(3),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING(128),
      allowNull: false
    },
    symbol: {
      type: Sequelize.STRING(4),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'tbcurrencies'
  });

  tbcurriences.associate = function(models){
    tbcurriences.hasMany(models.tborganisations, { foreignKey: { name: 'currencyid'} });
    tbcurriences.belongsToMany(models.tbplans, {
      through: 'tbcosts',
      foreignKey: 'currencyid',
      otherKey: 'planid',
      constraints: false
    });

    // tbcurriences.belongsToMany(models.tbplans, {
    //   through: 'tbcosts',
    //   foreignKey: 'currencyid',
    //   otherKey: 'planid'
    // });
//    tbcurriences.hasMany(models.tbcosts, { foreignKey: { name: 'currencyid'} });
//    tbcurrencies.belongsTo(models.tbcosts, { foreignKey: {name: 'currencyid' }});
  };

  return tbcurriences;
};
