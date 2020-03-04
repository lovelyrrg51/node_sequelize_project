/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tbwallet = sequelize.define('tbwallet', {
    transactionID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organisationID: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    time_stamp: {
      type: Sequelize.DATE,
      allowNull: false
    },
    adminid: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    amount: {
      type: "DOUBLE",
      allowNull: false
    }
  }, {
    tableName: 'tbwallet',
    timestamps: false
  });
  
  tbwallet.associate = function(models){
    tbwallet.belongsTo(models.tborganisations, { foreignKey: { name: 'organisationID' }});
//    tbusers.belongsTo(models.tborganisations);
  }

  return tbwallet;
};
