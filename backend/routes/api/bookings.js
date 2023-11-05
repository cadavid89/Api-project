const express = require("express");
const { Spot, SpotImage, Review, User, ReviewImage, Booking} = require("../../db/models");
const router = express.Router();
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

router.get('/current', requireAuth, async(req,res) => {
    const { user } = req
    const bookings = await Booking.findAll({
        where:{
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['description',' createdAt', 'updatedAt']
                }
                //  ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
        ]
    })

    const bookingObject = bookings.map(booking => booking.toJSON())
    const images = await SpotImage.findAll()

    for(let i = 0; i < bookingObject.length; i++){
        const booking = bookingObject[i];

        for (let j = 0; j < images.length; j++) {
            const image = images[j]

            if(image.spotId == booking.spotId) {
                if (image.preview === true) {
                    booking.Spot.previewImage = image.url;
                    break
                } else {
                    booking.Spot.previewImage = "Image not available"
                }
            } else {
                booking.Spot.previewImage = "Image not available"
            }
        }
            // booking.startDate = booking.startDate.toISOString().slice(0,10)
            // booking.endDate = booking.endDate.toISOString().slice(0,10)
            console.log(booking.startDate.toISOString().slice(0,10))
    }


        res.json({
            "Bookings": bookingObject})
    })

    //Edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const id = req.params.bookingId
    const { user } = req
    let {startDate, endDate} = req.body
    const {bookingId} = req.params

    const booking = await Booking.findByPk(id)

    if (!booking){
        res.status(404)
        return res.json({
            "message": "Booking couldn't be found"
        })
    }

    if (user.id !== booking.userId) {
        res.status(403)
        return res.json({
            "message": "Forbidden"
        })
    }

    const today = new Date().getTime()
    const newStart = new Date(startDate).getTime();
    const newEnd = new Date(endDate).getTime();

    if (today > newEnd) {
        res.status(403)
        return res.json({
            "message": "Past booking can't be modified"
        })
    }

    if (new Date(startDate) >= new Date(endDate)) {
        res.status(400)
        res.json({
            "message": "endDate cannot come before startDate"
        })
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id: {[Op.ne]: booking.id}
        }
    })

    const bookingObj = bookings.map(booking => booking.toJSON())

    for (let i = 0; i < bookingObj.length; i++) {

        const errors = {}
        errors.message = "Sorry, this spot is already booked for the specified dates"

        const bookingStart = new Date(booking.startDate).getTime()
        const bookingEnd = new Date(booking.endDate).getTime()


        if (newStart >= bookingStart && newStart < bookingEnd) {
            errors.startDate = "Start date conflicts with an existing booking"
        }

        if (newEnd <= bookingStart && newEnd > bookingEnd) {
            errors.endDate = "End date conflicts with an existing booking"
        }

        if (newStart < bookingStart && newEnd > bookingEnd) {
            errors.startDate = "Start date conflicts with an existing booking"
            errors.endDate = "End date conflicts with an existing booking"
        }

        if (errors.startDate || errors.endDate) {
            res.status(403)
            return res.json(errors)
        }
    }

    if(startDate) {
        booking.startDate = startDate
    }

    if(endDate){
        booking.endDate = endDate
    }

    await booking.save()

    res.json({
        booking
    })


})

//Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const id = req.params.bookingId
    const { user } = req
    const booking = await Booking.findByPk(id)

    if(!booking) {
        res.status(404)
        return res.json({
            "message": "Booking couldn't be found"
        })
    }

    if( user.id !== booking.userId){
        res.status(403)
        return res.json({
            "message": "Forbidden"
        })
    }

    let start = new Date(booking.startDate).toDateString()
    let today = new Date().toDateString()
    start = new Date(start).getTime()
    today = new Date(today).getTime()

    if (start <= today) {
        res.status(400);
        return res.json({
            "message": "Bookings that have been started can't be deleted"
        })
    }

    await booking.destroy()

   return res.json({
        "message": "Successfully deleted"
    })
})



module.exports = router;
