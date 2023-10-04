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
        attributes: ['url', 'preview']
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

    let previewImage = null

    spot.SpotImages.forEach(image => {
      if (image.preview === true){
        previewImage = image.url
      }
    })

    spot.previewImage = previewImage
    delete spot.SpotImages
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
      message: 'Nacho spot'
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
      message: "Nacho house"
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

module.exports = router;
