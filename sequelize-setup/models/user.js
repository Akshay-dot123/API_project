'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // define association here
      user.hasMany(models.order, {
        foreignKey: 'user_id',      // snake_case FK (matches underscored: true)
        sourceKey: 'id',            // optional, default is 'id'
        onDelete: 'CASCADE',        // optional: delete orders when user is deleted
        onUpdate: 'CASCADE',
      });
    }
  }
  user.init({
    email: {
      type:DataTypes.STRING,
      unique:true
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};