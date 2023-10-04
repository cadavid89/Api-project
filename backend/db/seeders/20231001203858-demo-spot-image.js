'use strict';

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'firstspot1.com',
        preview: true,
      },

      {
        spotId: 1,
        url: 'firstspot.com',
        preview: false,
      },

      {
        spotId: 2,
        url: 'secondspot1.com',
        preview: true,
      },

      {
        spotId: 2,
        url: 'secondspot.com',
        preview: false,
      },

      {
        spotId: 3,
        url: 'thirdspot1.com',
        preview: true,
      },

      {
        spotId: 3,
        url: 'thirdspot.com',
        preview: false,
      },

      {
        spotId: 4,
        url: 'fourthspot1.com',
        preview: false,
      },

      {
        spotId: 4,
        url: 'fourthspot.com',
        preview: true,
      },

      {
        spotId: 5,
        url: 'fifthspot1.com',
        preview: true,
      },

      {
        spotId: 5,
        url: 'fifthspot.com',
        preview: false,
      },

    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options);
   }
};
