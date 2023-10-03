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


// router.get('/', async (req, res, next) => {
//  const spots = await Spot.findAll({
//   include: [
//     {
//       model: Review,
//       attributes: []
//     }
//   ],
//   attributes: {
//     include: [
//       [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
//     ]
//   }
//  });

//  const spotsJson = spots.map(spot => spot.toJSON());

//  for(let i = 0; i < spotsJson.length; i++) {
//   const spot = spotsJson[i]
//   const spotId = spot.id

//   const preview = await SpotImage.findAll({
//     where: {
//       spotId: spotId,
//       preview: true
//     },
//     attributes: ['url']
//   })
//  }
//  res.json(spots)
// })

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

module.exports = router;
