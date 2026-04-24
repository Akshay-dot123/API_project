'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('order_logs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      order_id: { type: Sequelize.INTEGER, allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      action: { 
        type: Sequelize.ENUM('created', 'updated', 'deleted'), 
        allowNull: false 
      },
      new_total: { type: Sequelize.INTEGER, allowNull: true }, // ✅ Match trigger's NEW.total
      logged_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('order_logs');
  }
};
