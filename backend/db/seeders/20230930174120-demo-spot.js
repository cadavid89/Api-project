'use strict';

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 3,
        address: '123 Main Street',
        city: 'Orlando',
        state: 'Florida',
        country: 'United States',
        lat: 28.538336,
        lng: -81.379234,
        name: 'Cozy cottage',
        description: 'Cozy spot that sleeps 4',
        price: 125.50
      },

      {
        ownerId: 1,
        address: '456 East Road',
        city: 'Atlanta',
        state: 'Georgia',
        country: 'United States',
        lat: 33.748997,
        lng: -84.387985,
        name: 'Updated Condo',
        description: 'Minimalist condo in great area',
        price: 150.89
      },

      {
        ownerId: 2,
        address: '789 Broadway Avenue',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        lat: 40.712776,
        lng: -74.005974,
        name: 'Stylish loft',
        description: 'Loft that sleeps 6',
        price: 189.99
      }


    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Main Street', '456 East Road', '789 Broadway Avenue'] }
    }, {});
  }
};
