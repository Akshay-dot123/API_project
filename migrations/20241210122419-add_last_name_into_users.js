"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "dummies", // table name
        "last_name", // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          after: "first_name", // After which field I want to add
        }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn("dummy", "last_name")]);
  },
};
