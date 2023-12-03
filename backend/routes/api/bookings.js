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
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']

            },
        ]
    })

    const bookingObject = bookings.map(booking => booking.toJSON())
    const images = await SpotImage.findAll()

    for(let i = 0; i < bookingObject.length; i++){
        const booking = bookingObject[i];

        booking.startDate = booking.startDate.toISOString().split('T')[0]
        booking.endDate = booking.endDate.toISOString().split('T')[0]
        booking.createdAt = booking.createdAt.toISOString().split('T')[0]
        booking.updatedAt = booking.updatedAt.toISOString().split('T')[0]

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
    }

        res.json({
            "Bookings": bookingObject})
    })

    //Edit a booking

router.put('/:bookingId', requireAuth, async (req, res) => {
    const { user } = req
    let {startDate, endDate} = req.body
    const {bookingId} = req.params

    const booking = await Booking.findByPk(bookingId)

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

    const today = Date.now()
    const newStart = new Date(startDate).getTime();
    const newEnd = new Date(endDate).getTime();


    if (today > newEnd) {
        res.status(403)
        return res.json({
            "message": "Past booking can't be modified"
        })
    }

    if (newStart >= newEnd) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            "errors": "endDate cannot be on or before startDate"
        })
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id: {[Op.ne]: booking.id}
        }
    })

    const bookingObj = bookings.map(booking => booking.toJSON())

    const err = {}

    for (let i = 0; i < bookingObj.length; i++) {


        const bookingStart = new Date(bookingObj[i].startDate).getTime()
        const bookingEnd = new Date(bookingObj[i].endDate).getTime()


        if (newStart >= bookingStart && newStart <= bookingEnd) {
            err.startDate = "Start date conflicts with an existing booking"
        }

        if (newEnd >= bookingStart && newEnd <= bookingEnd) {
            err.endDate = "End date conflicts with an existing booking"
        }

        if (newStart < bookingStart && newEnd > bookingEnd) {
            err.dateRange = 'There is an existing booking between your start and end date'
        }


        if (Object.keys(err).length) {
            res.status(403)
            return res.json({
               message: "Sorry, this spot is already booked for the specified dates",
               errors: {...err}
            })
        }
    }

    if(startDate) {
        booking.startDate = startDate
    }

    if(endDate){
        booking.endDate = endDate
    }

    await booking.save()

    const currBookingObj = await booking.toJSON()

    currBookingObj.startDate = currBookingObj.startDate.toISOString().split('T')[0]
    currBookingObj.endDate = currBookingObj.endDate.toISOString().split('T')[0]
    currBookingObj.createdAt = currBookingObj.createdAt.toISOString().split('T')[0]
    currBookingObj.updatedAt = currBookingObj.updatedAt.toISOString().split('T')[0]

   return res.json(currBookingObj)


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
