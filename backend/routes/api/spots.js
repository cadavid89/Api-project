const express = require("express");
const { Op } = require("sequelize")
const { Spot, SpotImage, Review, User, ReviewImage, Booking} = require("../../db/models");
const router = express.Router();
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const {  validateSpot, validateReviews, validateQuery } = require('../../utils/errorValidators')

//Get all Spots
router.get('/', validateQuery, async (req,res,next) => {

  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
  const pagination = {}
  const where = {}

  if (!page) page = 1
  if (!size) size = 20

  if (minLat) where.lat = {[Op.gte]: minLat}
  if (maxLat) where.lat = {[Op.lte]: maxLat}
  if (minLng) where.lng = {[Op.gte]: minLng}
  if (maxLng) where.lng = {[Op.lte]: maxLng}
  if (minPrice) where.price = {[Op.gte]: minPrice}
  if (maxPrice) where.price = {[Op.lte]: maxPrice}

  pagination.limit = size
  pagination.offset = size * (page - 1)

  const spots = await Spot.findAll({
    include: [
      {
        model: SpotImage,
        attributes: ['url', 'preview']
      }
    ],
    where: {
      ...where
    },
    ...pagination
  });

  const spotObj = spots.map(spot => spot.toJSON());

  for(let i = 0; i < spotObj.length; i++){
    const spot = spotObj[i]

    const reviews = await Review.findAll({
      where: {
        spotId: spot.id
      }
    })

    const avgStarRating = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    }) / reviews.length;

    spot.avgRating = avgStarRating;

    let previewImage = null

    spot.SpotImages.forEach(image => {
      if (image.preview === true){
        previewImage = image.url
      }
    })

    spot.previewImage = previewImage
    delete spot.SpotImages
  }

  res.json({
    Spots: spotObj,
    page: Number(page),
    size: Number(size)
  })

})
//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req,res) => {
  const id = req.params.spotId
  const { user } = req
  const spot = await Spot.findByPk(id)

  if(!spot){
    res.status(404)
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  let bookings;
  console.log(user.id)
  if(spot.ownerId === user.id){
    bookings = await Booking.findAll({
      where: {
        spotId: spot.id
      },
     include: {
      model: User,
      attributes: ['id', 'firstName', 'lastName']
     }
    })
  } else {
    bookings = await Booking.findAll({
      where: {
        spotId: spot.id
      },
      attributes: ['spotId', 'startDate', 'endDate']
    })

  }

  res.json({
    "Bookings": bookings
  })
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async(req,res,next) =>{
  const id = req.params.spotId
  const spot = await Spot.findByPk(id)

  if(!spot){
    res.status(404)
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  const reviews = await Review.findAll({
    where: {
      spotId: spot.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  })

  return res.json({
    "Reviews": reviews
  })
})


//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id
    }
  });

  const spotsJson = spots.map(spot => spot.toJSON());
  const images = await SpotImage.findAll()

  for(let i = 0; i < spotsJson.length; i++){
    const spot = spotsJson[i]

    for (let j = 0; j < images.length; j++){
      const image = images[j];

      if (image.spotId == spot.id) {
        if (image.preview == true) {
          spot.previewImage = image.url;
          break;
        } else {
          spot.previewImage = 'Image not available'
        }
      }
    }


    const reviews = await Review.findAll({
      where: {
        spotId: spot.id
      }
    })

    const avgStarRating = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    }) / reviews.length;

    spot.avgRating = avgStarRating;
}
return res.json({
  Spots: spotsJson
})
})

//Get details of a Spot from an id
router.get('/:spotId', async (req,res, next) => {
  const id = req.params.spotId

  const spot = await Spot.findByPk(id)

   if(!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
   }

   const spotJson = spot.toJSON()

   const reviews = await Review.findAll({
    where: {
      spotId: spot.id
    }
  })

    const count = await Review.count({
      where: {
        spotId: spot.id
      }
    })

    spotJson.numReviews = count

    const avgStarRating = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    }) / reviews.length;

    spotJson.avgRating = avgStarRating

    const image = await SpotImage.findAll({
      where: {
        spotId: spot.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'spotId']
      }
    })

    spotJson.SpotImages = image

    spotJson.Owner = await spot.getUser({
      attributes: {
        exclude: ['username']
      }
    })

    return res.json(spotJson)
})

//Create a spot
router.post('/', [requireAuth, validateSpot], async (req,res,next) => {
 const { address, city, state, country, lat, lng, name, description, price} = req.body;


 const newSpot = await Spot.create({
  ownerId: req.user.id,
  address,
  city,
  state,
  country,
  lat,
  lng,
  name,
  description,
  price,
 })

res.status(201)
 return res.json(newSpot)
})

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async(req,res,next) => {
  const id = req.params.spotId;
  const currentUser = req.user.id;
  const spot = await Spot.findByPk(id)

  if(spot === null){
    res.status(404)
    return res.json({
      message: 'Spot couldn\'t be found'
    })
  }

  if(spot.ownerId !== currentUser) {
    res.status(403)
    return res.json({
      message: 'Forbidden'
    })
  }

const images = await spot.getSpotImages();

const { url, preview } = req.body;

const newImage = await SpotImage.create({
  spotId: spot.id,
  url,
  preview
})

images.push(newImage)

res.json({
  id: newImage.id,
  url: newImage.url,
  preview: newImage.preview
})
})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', [requireAuth, validateReviews], async (req, res) => {
  const id = req.params.spotId
  const { user } = req;
  const { review, stars } = req.body
  const spot = await Spot.findByPk(id)

  if(!spot || !user){
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  const existingReview = await Review.findOne({
    where: {
      spotId: spot.id,
      userId: user.id
    }
  })

  if (existingReview){
    res.status(500)
    return res.json({
      message: "User already has a review for this spot"
    })
  }

  const newReview = await Review.create({
    userId: user.id,
    spotId: id,
    review,
    stars
  })

  res.status(201)
  return res.json(newReview)
  })


//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async(req,res) => {
  const id = req.params.spotId
  const { user } = req
  const spot = await Spot.findByPk(id)
  let {startDate, endDate} = req.body

  let requestedStart = new Date(startDate).toDateString()
  let requestedEnd = new Date(endDate).toDateString()
  requestedStart = new Date(requestedStart).getTime()
  requestedEnd = new Date(requestedEnd).getTime()

  if(requestedStart >= requestedEnd) {
    res.status(400);
    return res.json({
      "message": "Bad Request",
      "errors": {
        "endDate": "endDate cannot be on or before startDate"
      }
    })
  }

  if(!spot){
    res.status(404)
    res.json({
      "message": "Spot couldn't be found"
    })
  }

  if(spot.ownerId === user.id){
    res.status(403);
    res.json({
      "message": "Forbidden"
    })
  }

  const bookings = await Booking.findAll({
    where: {
      spotId: spot.id
    }
  })

  const bookingObj = bookings.map(booking => booking.toJSON())

  for (let i = 0; i < bookingObj.length; i++) {
   const booking = bookingObj[i]
    let err = {}
    err.errors = {}
    err.message = 'Sorry, this spot is already booked for the specified dates'

    let responseStart = new Date(booking.startDate).toDateString()
    let responseEnd = new Date(booking.endDate).toDateString()
    responseStart = new Date(responseStart).getTime()
    responseEnd = new Date(responseEnd).getTime()

    if(requestedStart < responseStart && requestedEnd > responseEnd) {
      err.errors.dateRange = "Existing booking between start and end dates"
    }

    if(requestedStart <= responseEnd && requestedStart >= responseStart){
      err.errors.startDate = "Start date conflicts with an existing booking"
    }
    if(requestedEnd >= responseStart && requestedEnd <= responseEnd) {
      err.errors.endDate = "End date conflicts with an existing booking"
    }

    if(err.errors.dateRange || err.errors.startDate || err.errors.endDate) {
      res.status(403)
      return res.json(err)
    }
  }

  const newBooking = await Booking.create({
    spotId: spot.id,
    userId: user.id,
    startDate,
    endDate
  })

  res.json(newBooking)
})

//Edit a spot
router.put('/:spotId', [requireAuth, validateSpot], async(req,res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;
  const id = req.params.spotId
  const spot = await Spot.findByPk(id)

  if(!spot || !user){
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  if(spot.ownerId !== user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }


  spot.address = address
  spot.city = city
  spot.state = state
  spot.country = country
  spot.lat = lat
  spot.lng = lng
  spot.name = name
  spot.description = description
  spot.price = price

  await spot.save()

  return res.json(spot)
})

router.delete('/:spotId', requireAuth, async (req,res,next) => {
  const id = req.params.spotId
  const { user } = req
  const spot = await Spot.findByPk(id)

  if(!spot || !user){
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  if(spot.ownerId !== user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  await spot.destroy();

  res.json({
    message: "Successfully deleted"
  })

})

module.exports = router;
