const router = require('express').Router()
// const router = express.Router
const {requireAuth} = require('../../utils/auth')
const {Review, ReviewImage} = require('../../db/models')

router.delete('/:imageId', requireAuth, async (req,res,next) => {
    const { user } = req
    const id = req.params.imageId

    const image = await ReviewImage.findByPk(id)

    if(!image) {
        res.status(404)
        return res.json({
            message: "Review Image couldn't be found"
        })
    }

    const review = await Review.findByPk(image.reviewId)
    console.log(review)

    if (review.userId !== user.id) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        })
    }

    await image.destroy()

    res.json({
        message: "Successfully deleted"
    })
})


module.exports = router
