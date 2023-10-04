const express = require("express");
const { Spot, Review, User, ReviewImage} = require("../../db/models");
const router = express.Router();
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next)  => {
    const { user } = req
    const reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']

            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    return res.json({
        "Reviews": reviews})
})


module.exports = router
