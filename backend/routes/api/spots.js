const express = require("express");
const { Spot, SpotImage, Review, User} = require("../../db/models");
const router = express.Router();
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .isDecimal()
    .withMessage("Latitude is not valid"),
  check('lng')
    .isDecimal()
    .withMessage("Longitude is not valid"),
  check('lat')
    .isLength({Max: 50})
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists()
    .withMessage("Description is required"),
  check('price')
    .exists()
    .withMessage("Price per day is required"),
  handleValidationErrors
];

//Get all Spots
router.get('/', async (req,res,next) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: SpotImage,
        attributes: ['url']
      }
    ]
  });

  const spotJson = spots.map(spot => spot.toJSON());

  for(let i = 0; i < spotJson.length; i++){
    const spot = spotJson[i]

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
    spot.previewImage = spot.SpotImages[0].url
    delete spot.SpotImages
  }

  res.json({
    Spots: spotJson
  })

})

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id
    },
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        where: {
          preview: true
        }
      }
    ]
  });

  const spotsJson = spots.map(spot => spot.toJSON());

  for(let i = 0; i < spotsJson.length; i++){
    const spot = spotsJson[i]


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
    spot.previewImage = spot.SpotImages[0].url
    delete spot.SpotImages
}
return res.json({
  Spots: spotsJson
})
})

//Get details of a Spot from an id
router.get('/:spotId', async (req,res, next) => {
  const id = req.params.spotId

  const spot = await Spot.unscoped().findByPk(id)

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

  const {user} = req

 const newSpot = await Spot.create({
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

newSpot.ownerId = user.id
 return res.json(newSpot)
})

module.exports = router;
