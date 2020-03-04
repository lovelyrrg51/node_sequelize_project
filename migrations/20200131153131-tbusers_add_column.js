'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'tbusers',
        'emailConfirmationToken',
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'tbusers',
        'emailConfirmed',
        {
          type: Sequelize.BOOLEAN
        }
      ),
      queryInterface.addColumn(
        'tbusers',
        'resetPasswordToken',
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'tbusers',
        'resetPasswordTokenExpiration',
        {
          type: Sequelize.DATE
        }
      )
    ]);
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbusers', 'emailConfirmationToken'),
      queryInterface.removeColumn('tbusers', 'emailConfirmed'),
      queryInterface.removeColumn('tbusers', 'resetPasswordToken'),
      queryInterface.removeColumn('tbusers', 'resetPasswordTokenExpiration')
    ]);
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
