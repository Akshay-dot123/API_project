"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Register extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Register.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Register",
    }
  );
  return Register;
};

// Newly created and doubt

// const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
// class Register extends Model {}
// Register.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//   },
//   { sequelize, modelName: "Register", timestamps: true }
// );

// Register.associate = (models) => {
//   Register.hasOne(models.User, {
//     foreignKey: "registerId",
//     onDelete: "CASCADE",
//   });
// };

// module.exports = Register;
