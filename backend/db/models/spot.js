'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      })

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      })

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      })
    }

  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false
    },

    lat: {
      type: DataTypes.DECIMAL(10,7),
      validate: {
        min: -90.0000000,
        max: 90.0000000
      }
    },

    lng: {
      type: DataTypes.DECIMAL(10,7),
      validate: {
       min: -180.0000000,
       max: 180.0000000
      }
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4,50]
      }
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false
    },

    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
