const express = require("express");
const {
  Spot,
  Review,
  User,
  ReviewImage,
  SpotImage,
} = require("../../db/models");
const router = express.Router();
const sequelize = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { validateReviews } = require("../../utils/errorValidators");

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;
  const reviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  const reviewObject = reviews.map((review) => review.toJSON());
  const images = await SpotImage.findAll();

  for (let i = 0; i < reviewObject.length; i++) {
    const review = reviewObject[i];

    for (let j = 0; j < images.length; j++) {
      const image = images[j];

      if (image.spotId == review.spotId) {
        if (image.preview == true) {
          review.Spot.previewImage = image.url;
          break;
        } else {
          review.Spot.previewImage = "Image not available";
        }
      }
    }
  }

  res.json({
    Reviews: reviewObject,
  });
});

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const id = req.params.reviewId;
  const { user } = req;
  const review = await Review.findByPk(id);

  // const imageCount = await ReviewImage.count({
  //   where: {
  //     reviewId: review.id,
  //   },
  // });

  // if (imageCount === 10) {
  //   res.status(403);
  //   return res.json({
  //     message: "Maximum number of images for this resource was reached",
  //   });
  // }

  if (!review) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }

  const images = await review.getReviewImages();

  if (images.length >= 10) {
    res.status(403)
    return res.json({
      message: "Maximum number of images for this resource was reached"
    })
  }
  const { url } = req.body;

  const newImage = await ReviewImage.create({
    reviewId: review.id,
    url
  });

  images.push(newImage);

  res.json({
    id: newImage.id,
    url: newImage.url,
  });
});

//Edit a review
router.put("/:reviewId",[requireAuth, validateReviews], async (req, res, next) => {
  const { review, stars } = req.body;
  const { user } = req;
  const id = req.params.reviewId;
  const reviewed = await Review.findByPk(id);

  if (!reviewed) {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
    });
  }

  if (reviewed.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }

  reviewed.review = review;
  reviewed.stars = stars;

  await reviewed.save();
  return res.json(reviewed);
});

//Delete a review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const id = req.params.reviewId;
  const { user } = req;
  const review = await Review.findByPk(id);

  if (!review || !user) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }

  await review.destroy();

  res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
