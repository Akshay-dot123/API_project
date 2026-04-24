'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addColumn('orders', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // ⚠️ Must be true initially for existing rows
      comment: 'Foreign key referencing users.id'
    });
    await queryInterface.addConstraint('orders', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_orders_user_id', // optional but helpful for debugging
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE', // ✅ This is what actually enables cascade delete
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn("orders", "user_id");
  }
};
