"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class dummy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dummy.init(
    {

      first_name: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "dummy",
    }
  );
  return dummy;
};
