'use strict';

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Review.bulkCreate([
    {
      spotId: 1,
      userId: 1,
      review: 'Amazing place close to Disney',
      stars: 5
    },

      {
      spotId: 1,
      userId: 2,
      review: 'Uncomfortable bed',
      stars: 3
    },

    {
      spotId: 2,
      userId: 2,
      review: 'Cool condo',
      stars: 4
    },

    {
      spotId: 3,
      userId: 3,
      review: 'Great spot in NY',
      stars: 5
    },

    {
      spotId: 4,
      userId: 3,
      review: 'Whatever',
      stars: 3
    },

      {
      spotId: 4,
      userId: 5,
      review: 'Great spot in Mia',
      stars: 4
    },

    {
      spotId: 4,
      userId: 6,
      review: 'Loved it!',
      stars: 5
    },

    {
      spotId: 5,
      userId: 1,
      review: 'Breath taking',
      stars: 5
    },

   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
   const Op = Sequelize.Op
   return queryInterface.bulkDelete(options);
  }
};
