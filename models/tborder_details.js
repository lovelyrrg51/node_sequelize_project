/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('tborder_details', {
    orderdetailsid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    orderid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    planid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    qty: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    activation_deadline: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tborder_details',
    timestamps:false
  });
};
