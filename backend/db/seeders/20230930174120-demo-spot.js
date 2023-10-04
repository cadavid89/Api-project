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
      },

      {
        ownerId: 1,
        address: '68 Bayview Dr',
        city: 'Miami',
        state: 'Florida',
        country: 'United States',
        lat: 25.761744,
        lng: 80.191844,
        name: 'Minimalist Dream',
        description: 'Minimalist spot in high rise',
        price: 200.22
      },

      {
        ownerId: 2,
        address: '7264 W Sunset Blvd',
        city: 'Los Angles',
        state: 'California',
        country: 'United States',
        lat: 34.054944,
        lng: 34.054944,
        name: 'Mega mansion',
        description: 'Sleeps 10 in great area',
        price: 360.33
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};
