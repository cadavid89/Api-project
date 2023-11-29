const { handleValidationErrors } = require('./validation')
const { check } = require('express-validator')

const validate = {
    validateSpot: [
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
      check('name')
        .exists({checkFalsy: true})
        .withMessage('Name is required')
        .isLength({Max: 50})
        .withMessage("Name must be less than 50 characters"),
      check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
      check('price')
        .exists()
        .withMessage("Price per day is required")
        .isInt({min: 1})
        .withMessage('Price per day must be greater than 0'),
      handleValidationErrors
    ],

    validateReviews: [
      check('review')
        .exists({checkFalsy: true})
        .withMessage("Review text is required"),
      check('stars')
        .exists()
        .isInt({min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5"),
      handleValidationErrors
    ],

    validateQuery: [
      check("page")
      .optional()
      .isInt({min: 1, max: 10})
      .withMessage("Page must be greater than or equal to 1"),
      check("size")
      .optional()
      .isInt({min: 1, max: 20})
      .withMessage("Size must be greater than or equal to 1"),
      check("minLat")
      .optional()
      .isFloat({ min: -90.0000000, max: 90.0000000})
      .withMessage("Minimum latitude is invalid"),
      check("maxLat")
      .optional()
      .isFloat({ min: -90.0000000, max: 90.0000000})
      .withMessage("Maximum latitude is invalid"),
      check("minLng")
      .optional()
      .isFloat({ min: -180.0000000, max: 180.0000000})
      .withMessage("Minimum longitude is invalid"),
      check("maxLng")
      .optional()
      .isFloat({ min: -180.0000000, max: 180.0000000})
      .withMessage("Maximum longitude is invalid"),
      check("minPrice")
      .optional()
      .isFloat({ min: 0})
      .withMessage("Minimum price must be greater than or equal to 0"),
      check("maxPrice")
      .optional()
      .isFloat({min: 0})
      .withMessage("Maximum price must be greater than or equal to 0"),
      handleValidationErrors
    ]
  }

  module.exports = validate
