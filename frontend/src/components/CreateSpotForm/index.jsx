import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect  } from "react"
import { useNavigate } from "react-router-dom"
import { allSpotsThunk, createSpotThunk, addSpotImagesThunk, singleSpotThunk } from "../../store/spots"
import './CreateSpotForm.css'

export default function CreateSpotForm (){
    const user = useSelector((state) => state.session.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    const [image5, setImage5] = useState('')
    const [errors, setErrors] = useState({})

    const imageValidation = (url) => {
        if(url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) return true
        else return false
    }

    const handleSubmit = async (event) => {

        event.preventDefault()

        const errObj = {}
        if (!country) errObj.country = 'Country is required'
        if (!address) errObj.address = 'Address is required'
        if (!city) errObj.city = 'City is required'
        if (!state) errObj.state = 'State is required'
        if (!description || description.length < 30) errObj.description = 'Description must be a minimum of 30 characters'
        if (!name) errObj.name = 'Name is required'
        if (!price || price < 1 ) errObj.price = 'Price per day is required'
        if (!previewImage) errObj.previewImage = 'Preview image is required'
        if (image2 && !imageValidation(image2)) errObj.image2 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image3 && !imageValidation(image3)) errObj.image3 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image4 && !imageValidation(image4)) errObj.image4 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image5 && !imageValidation(image5)) errObj.image5 = "Image URL must end in .png, .jpg, or .jpeg"



        const newSpot = {
            ownerId: user.id,
            country,
            address,
            city,
            state,
            description,
            name,
            price
        }

        const images = [
            {
                url: previewImage,
                preview: true
            }
        ]

        [image2,image3, image4, image5].forEach((url) => {
            if (url) {
                images.push({
                    url,
                    preview: false
                })
            }
        })

        if(Object.values(errObj).length) {
            setErrors(errObj)
        } else {
            const spot = await dispatch(createSpotThunk(newSpot, images))
            navigate(`/spots/${spot.id}`)

        }
    }

    return (
        <div className="create-spot-main-container">
            <form className="create-spot-form" onSubmit={handleSubmit}>
                <div className="create-spot-location ">
                    <h1>Create a New Spot</h1>
                    <h2>Where's you place located</h2>
                    <h4>Guests will only get your exact address once they've booked a reservation.</h4>
                    <label>
                        <div className="create-spot-label">
                            Country
                            {errors.country && <p className="errors">{errors.country}</p>}
                        </div>
                    </label>
                </div>
            </form>
        </div>
    )
}
