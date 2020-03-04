/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tborders = sequelize.define('tborders', {
    orderid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    placed: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    },
    fulfilled: {
      type: Sequelize.DATE,
      allowNull: true
    },
    cancelled: {
      type: Sequelize.DATE,
      allowNull: true
    },
    organisationid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    deleted: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    timestamps: false,
    tableName: 'tborders'
  });

  tborders.associate = function(models){
    tborders.belongsTo(models.tborganisations, { foreignKey: { name: 'organisationid' }});
//    tbusers.belongsTo(models.tborganisations);
  }

  return tborders;
};
