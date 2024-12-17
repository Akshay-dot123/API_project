// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   User.init({
//     age: DataTypes.NUMBER,
//     Date_of_birth: DataTypes.DATE,
//     Gender: DataTypes.CHAR
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };



// 'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Register, {
        foreignKey: 'registerId',
        onDelete: 'CASCADE', 
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    registerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique:true,
      references: {
        model: 'Registers',
        key: 'id',
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true, 
    },
    gender: {
      type: DataTypes.TINYINT,
      comment: "0-female, 1-male, 2-other",
    },
  }, { 
    sequelize, 
    modelName: 'User', 
    timestamps: true, 
  });

  return User;
};