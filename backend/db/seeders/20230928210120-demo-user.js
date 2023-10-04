"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Alex',
        lastName: 'Cadavid',
        email: 'Alex@user.io',
        username: 'Alex89',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Dani',
        lastName: 'Florence',
        email: 'Dani@user.io',
        username: 'Dani91',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Apollo',
        lastName: 'Cadavid',
        email: 'Apollo@user.io',
        username: 'Apollo21',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Clarence',
        lastName: 'Josey',
        email: 'Cj@user.io',
        username: 'Clarence21',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Tareq',
        lastName: 'Vurdubakis',
        email: 'Tareq@user.io',
        username: 'Tareq90',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Brian',
        lastName: 'Duffy',
        email: 'BDuff@user.io',
        username: 'Brian21',
        hashedPassword: bcrypt.hashSync('password6')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
