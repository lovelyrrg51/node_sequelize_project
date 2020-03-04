/* jshint indent: 2 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const tborganisations = sequelize.define('tborganisations', {
    organisationid: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    reg_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    },
    erp_code: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    legal_name: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    trade_name: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    website: {
      type: Sequelize.STRING(256),
      allowNull: true
    },
    org_type: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    taxid: {
      type: Sequelize.STRING(48),
      allowNull: true
    },
    state_taxpayer_type: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    state_registration: {
      type: Sequelize.STRING(48),
      allowNull: true
    },
    municipal_registration: {
      type: Sequelize.STRING(48),
      allowNull: true
    },
    timezone: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    language: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    currencyid: {
      type: Sequelize.INTEGER(11),
//      primaryKey: true,
      allowNull: false
    },
    gen_addr_countryid: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    gen_addr_postal_code: {
      type: Sequelize.STRING(16),
      allowNull: true
    },
    gen_addr_city: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    gen_addr_stateid: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    gen_addr_address: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    gen_addr_number: {
      type: Sequelize.STRING(16),
      allowNull: true
    },
    gen_addr_complement: {
      type: Sequelize.STRING(128),
      allowNull: true
    },
    gen_addr_neighborhood: {
      type: Sequelize.STRING(256),
      allowNull: true
    },
    bil_addr_countryid: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    bil_addr_postal_code: {
      type: Sequelize.STRING(16),
      allowNull: true
    },
    bil_addr_city: {
      type: Sequelize.STRING(256),
      allowNull: true
    },
    bil_addr_stateid: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    bil_addr_address: {
      type: Sequelize.STRING(256),
      allowNull: true
    },
    bil_addr_number: {
      type: Sequelize.STRING(16),
      allowNull: true
    },
    bil_addr_complement: {
      type: Sequelize.STRING(128),
      allowNull: true
    },
    bil_addr_neighborhood: {
      type: Sequelize.STRING(256),
      allowNull: true
    },
    contact_person: {
      type: Sequelize.STRING(256),
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING(32),
      allowNull: true
    },
    mobile: {
      type: Sequelize.STRING(32),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(512),
      allowNull: true
    },
    lock_status: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    toggle_lock_status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    suspend_all_simcards: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    deleted: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    payment_type: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    payment_term: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: '60'
    }
  }, {
    timestamps: false,
    tableName: 'tborganisations'
  });

  tborganisations.associate = function(models){
    tborganisations.hasMany(models.tbusers, { foreignKey: { name: 'organisationid'} });
    tborganisations.hasMany(models.tblogs, { foreignKey: {name: 'organisationid' }});
    tborganisations.hasMany(models.tbwallet, { foreignKey: { name: 'organisationid'} });
    tborganisations.hasMany(models.tborders, { foreignKey: { name: 'organisationid'} }); 
    tborganisations.hasMany(models.tbsimcards, { foreignKey: { name: 'organisationid'} }); 

    tborganisations.belongsTo(models.tbcurrencies, { foreignKey: {name: 'currencyid' }});
/*    tborganisations.belongsToMany(models.tbplans, {
      foreignKey: 'currencyid',
      otherKey: 'planid',
      through: {
        model: models.tbcosts,
        foreignKey: 'planid',
        otherKey: 'currencyid'
      },
      constraints: false
    });*/

//    tborganisations.hasMany(models.tbcosts, { foreignKey: {name: 'currencyid' }});
//    tborganisations.belongsTo(models.tbcosts, { foreignKey: {name: 'currencyid' }});
        //tborganisations.belongsTo(models.tbcurrencies);
  };

  return tborganisations;
};
