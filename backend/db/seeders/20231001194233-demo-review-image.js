'use strict';

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await ReviewImage.bulkCreate([
    {
      reviewId: 1, //Orlando
      url: 'https://t3.ftcdn.net/jpg/01/62/06/40/360_F_162064034_HI2YEgV7km3HMy0rccQczKH2vvpI4OnB.jpg'
    },

    {
      reviewId: 2, //NY
      url: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2020/06/New-York-Loft-Decorating-Style-online-interior-designer.png'
    },

    {
      reviewId: 3, //ATL
      url: 'https://ap.rdcpix.com/b07f9fc8dc0a21efcd1efe460391c7d3l-m1149231117od-w480_h360.jpg'
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1,2,3] }
    }, {})
  }
};
