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

router.post('/:reviewId/images', requireAuth, async(req,res,next) => {
    const id = req.params.reviewId
    const { user } = req
    const review = await Review.findByPk(id)

    const imageCount = await ReviewImage.count({
        where: {
            reviewId: review.id
        }
    })

    if (imageCount === 10) {
        res.status(403)
        return res.json({
            "message": "Maximum number of images for this resource was reached"
        })
    }
    if(review === null){
        res.status(404)
        return res.json({
            message: "Review couldn't be found"
        })
    }

    if(review.userId !== user.id){
        res.status(403)
        return res.json({
            message: 'Nacho review'
        })
    }

    const images = await review.getReviewImages()
    const { url } = req.body

    const newImage = await ReviewImage.create({
        url
    })

    images.push(newImage)

    res.json({
        id: newImage.id,
        url: newImage.url
    })
})

//Edit a review
router.put('/:reviewId', requireAuth, async (req,res,next) => {
    const { review, stars } = req.body
    const { user } = req
    const id = req.params.reviewId
    const reviewed = await Review.findByPk(id)

    if(!reviewed || !user) {
        res.status(404);
        res.json({
            message: "Review couldn't be found"
        })
    }


  if(reviewed.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Nacho review"
    })
  }

  reviewed.review = review
  reviewed.stars = stars

  await reviewed.save()
  return res.json(reviewed)
})

//Delete a review
router.delete('/:reviewId', requireAuth, async(req,res) => {
    const id = req.params.reviewId
    const { user } = req
    const review = await Review.findByPk(id)

    if(!review || !user){
        res.status(404);
        return res.json({
          message: "Review couldn't be found"
        })
      }

      if(review.userId !== user.id) {
        res.status(403);
        return res.json({
          message: "Nacho review"
        })
      }

      await review.destroy()

      res.json({
        message: "Successfully deleted"
      })
})

module.exports = router
