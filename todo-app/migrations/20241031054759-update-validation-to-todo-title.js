'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("Todos", "title", {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    // Revert the column back to the previous state
    await queryInterface.changeColumn("Todos", "title", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
