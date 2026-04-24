'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    static associate(models) {
      // define association here
      order.belongsTo(models.user, {
        foreignKey: 'user_id',      // must match the FK defined in hasMany
        targetKey: 'id',            // optional, default is 'id'
      });
    }
  }
  order.init({
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};