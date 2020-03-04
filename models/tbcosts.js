/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbcosts = sequelize.define('tbcosts', {
    planid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'tbplans', 
        key: 'planid'
      }
    },
    cost_type: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    currencyid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'tbcurrencies', 
        key: 'currencyid'
      }
    },
    amount: {
      type: "DOUBLE",
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'tbcosts'
  });

  tbcosts.associate = function(models){
    tbcosts.belongsTo(models.tborganisations, {foreignKey: 'currencyid', targetKey: 'currencyid'});
    tbcosts.belongsTo(models.tbplans, {foreignKey: 'planid', targetKey: 'planid'});
  };

  return tbcosts;
};
