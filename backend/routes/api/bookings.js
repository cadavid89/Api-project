const express = require("express");
const { Spot, SpotImage, Review, User, ReviewImage, Booking} = require("../../db/models");
const router = express.Router();
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/current', requireAuth, async(req,res) => {
    const { user } = req
    const bookings = await Booking.findAll({
        where:{
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [
                    {
                        model: SpotImage,
                        attributes: ['url', 'preview'],
                        where: {
                            preview: true
                        }
                    }
                ]
            },
        ]
    })

    const bookingObject = bookings.map(review => review.toJSON())

    for(let i = 0; i < bookingObject.length; i++){
        const booking = bookingObject[i]

        let previewImage = null

        booking.Spot.SpotImages.forEach(image => {
            if (image.preview){
                previewImage = image.url

            }
        })

        booking.Spot.previewImage = previewImage
        delete booking.Spot.SpotImages
    }
    return res.json({
        "Bookings": bookingObject})
})



module.exports = router;
