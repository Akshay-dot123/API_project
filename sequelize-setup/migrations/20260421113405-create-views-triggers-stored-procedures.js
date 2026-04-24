'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // CREATE VIEW - table should always be present in views
   await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW user_orders_view AS
      SELECT u.id AS user_id, u.email, o.id AS order_id, o.total, o.createdAt
      FROM users u JOIN orders o ON u.id = o.user_id
    `, { type: Sequelize.QueryTypes.RAW });

    // 2️⃣ CREATE TRIGGER - table should always be present in triggers
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_order_insert
      AFTER INSERT ON orders FOR EACH ROW
      INSERT INTO order_logs (order_id, user_id, action, new_total)
      VALUES (NEW.id, NEW.user_id, 'created', NEW.total)
    `, { type: Sequelize.QueryTypes.RAW });

    // 3️⃣ CREATE STORED PROCEDURE  - should always be present in procedures
    // await queryInterface.sequelize.query(`
    //   CREATE PROCEDURE sp_get_user_stats(IN p_user_id INT)
    //   BEGIN
    //     SELECT 
    //       COUNT(o.id) AS total_orders,
    //       COALESCE(SUM(o.total), 0) AS total_spent
    //     FROM orders o WHERE o.user_id = p_user_id;
    //   END
    // `, { type: Sequelize.QueryTypes.RAW });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_get_user_stats');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_order_insert');
    // await queryInterface.sequelize.query('DROP VIEW IF EXISTS user_orders_view');
  }
};
