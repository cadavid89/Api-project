const express = require("express");
const { Spot, SpotImage, Review } = require("../../db/models");
const router = express.Router();
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");


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

router.get('/:spotId', async (req,res) => {
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

    const avgStarRating = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    }) / reviews.length;

    spotJson.avgRating = avgStarRating

    const image = await SpotImage.findAll({
      where: {
        spotId: spot.id,

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

module.exports = router;
