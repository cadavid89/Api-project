import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSpotThunk } from "../../store/spots";
import "./CreateSpotForm.css";

export default function CreateSpotForm() {
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");
  const [errors, setErrors] = useState({});
  const [submit, setSubmit] = useState(false);

  const imageValidation = (url) => {
    if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg"))
      return true;
    else return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errObj = {};
    if (!country) errObj.country = "Country is required";
    if (!address) errObj.address = "Address is required";
    if (!city) errObj.city = "City is required";
    if (!state) errObj.state = "State is required";
    if (!description || description.length < 30)
      errObj.description = "Description must be a minimum of 30 characters";
    if (!name) errObj.name = "Name is required";
    if (!price || price < 1) errObj.price = "Price per day is required";
    if (!previewImage) errObj.previewImage = "Preview image is required";
    if (image2 && !imageValidation(image2))
      errObj.image2 = "Image URL must end in .png, .jpg, or .jpeg";
    if (image3 && !imageValidation(image3))
      errObj.image3 = "Image URL must end in .png, .jpg, or .jpeg";
    if (image4 && !imageValidation(image4))
      errObj.image4 = "Image URL must end in .png, .jpg, or .jpeg";
    if (image5 && !imageValidation(image5))
      errObj.image5 = "Image URL must end in .png, .jpg, or .jpeg";

    if (Object.values(errObj).length > 0) {
      setErrors(errObj);
      return;
    }

    const newSpot = {
      ownerId: user.id,
      country,
      address,
      city,
      state,
      description,
      name,
      price,
    };

    let images = [previewImage];

    if (image2) images.push(image2);
    if (image3) images.push(image3);
    if (image4) images.push(image4);
    if (image5) images.push(image5);

    const res = await dispatch(createSpotThunk(newSpot, images));

    if (!res.errors) {
      navigate(`spots/${newSpot.id}`);
      setSubmit(true);
      reset()
    }
  };

  const reset = () => {
    setCountry("");
    setAddress("");
    setCity("");
    setState("");
    setLat("");
    setLng("");
    setDescription("");
    setName("");
    setPrice("");
    setPreviewImage("");
    setImage2("");
    setImage3("");
    setImage4("");
    setImage5("");
  };

  useEffect(() => {
    setSubmit(false);
    setErrors({})
  }, [submit])


  return (
    <div className="create-spot-main-container">
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <div className="create-spot-location ">
          <h1>Create a New Spot</h1>
          <h2>Where's your place located?</h2>
          <h4>
            Guests will only get your exact address once they've booked a
            reservation.
          </h4>
          <label>
            <div className="create-spot-label">
              Country
              {errors.country && <p className="errors">{errors.country}</p>}
            </div>
            <input
              className="input-box"
              type="text"
              placeholder="Country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            />
          </label>
          <label>
            <div className="create-spot-label">
              Street Address
              {errors.address && <p className="errors">{errors.address}</p>}
            </div>
            <input
              className="input-box"
              type="text"
              placeholder="Street Address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            {errors.address && <p className="errors">{errors.address}</p>}
          </label>
          <label>
            <div className="create-spot-label">City</div>
            <input
              className="input-box"
              type="text"
              placeholder="City"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
            {errors.city && <p className="errors">{errors.city}</p>}
          </label>
          <label>
            <div className="create-spot-label">State</div>
            <input
              className="input-box"
              type="text"
              placeholder="STATE"
              value={city}
              onChange={(event) => setState(event.target.value)}
            />
            {errors.state && <p className="errors">{errors.state}</p>}
          </label>
          <label>
            <div className="create-spot-label">Latitude</div>
            <input
              type="text"
              placeholder="Latitude"
              value={lat}
              onChange={(event) => setLat(event.target.value)}
            />
            {errors.lat && <p className="errors">{errors.lat}</p>}
          </label>
          <label>
            <div className="create-spot-label">Longitude</div>
            <input
              type="text"
              placeholder="Longitude"
              value={lng}
              onChange={(event) => setLng(event.target.value)}
            />
            {errors.Lng && <p className="errors">{errors.Lng}</p>}
          </label>

          <div className="form-break" />
          <h2>Describe your place to guests</h2>
          <h4>
            Mention the best features of your place, any special amenities like
            fast wifi or parking, and what you love about the neighborhood
          </h4>
          <input
            className="input-box"
            id="text-area"
            type="textarea"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {errors.description && <p className="errors">{errors.description}</p>}

          <div className="form-break" />
          <h2>Create a title for your spot</h2>
          <h4>
            Catch guests' attention with a spot title that highlights what makes
            your place special
          </h4>
          <input
            className="input-box"
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name && <p className="'errors">{errors.name}</p>}
          <div className="form-break" />
          <h2>Set a base price for your spot</h2>
          <h4>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </h4>
          <div className="price">
            <span className="$"> $ </span>
            <input
              className="input-box"
              type="number"
              placeholder="Price per night (USD"
              onChange={(event) => setPrice(event.target.value)}
            />
            {errors.price && <p className="errors">{errors.price}</p>}
          </div>
          <div className="form-break" />
          <div className="create-spot-button">
            <button className="create-button" type="submit">Create Spot</button>
          </div>
        </div>
      </form>
    </div>
  );
}
