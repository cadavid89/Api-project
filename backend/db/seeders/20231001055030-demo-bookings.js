'use strict';

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-12-28',
        endDate: '2024-01-02',
      },

      {
        spotId: 2,
        userId: 2,
        startDate: '2023-10-27',
        endDate: '2023-11-01',
      },

      {
        spotId: 1,
        userId: 1,
        startDate: '2023-09-30',
        endDate: '2023-10-02',
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
   options.tableName = 'Bookings';
   const Op = Sequelize.Op
   return queryInterface.bulkDelete(options, {
    userId: { [Op.in]: [1, 2, 3] }
   }, {});
  }
};
