const router = require('express').Router()
// const router = express.Router
const {requireAuth} = require('../../utils/auth')
const {Spot, SpotImage, User} = require('../../db/models')

router.delete('/:imageId', requireAuth, async (req,res,next) => {
    const { user } = req
    const id = req.params.imageId

    const image = await SpotImage.findByPk(id)

    if(!image) {
        res.status(404)
        return res.json({
            message: "Spot Image couldn't be found"
        })
    }

    const spot = await Spot.findByPk(image.spotId)
    console.log(spot)
    if (spot.ownerId !== user.id) {
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
