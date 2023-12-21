import { deleteSpotThunk } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useDispatch} from "react-redux";
import React from "react";
import "./DeleteSpotModal.css";

export default function DeleteSpotModal({ spot }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const handleClick = async (event) => {
    event.preventDefault();

    await dispatch(deleteSpotThunk(spot.id).then(closeModal))

    navigate('/')
    // try {
    //   dispatch(deleteSpotThunk(spot.id));
    //   closeModal();
    //   navigate("spots/current");
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <div className="delete-spot-modal">
        <h1>Confirm Delete</h1>
        <span className="delete-spot-modal-text">
            Are you sure you want to remove this spot?
        </span>
        <button className="yes-delete-button" onClick={handleClick}>
            Yes (Delete Spot)
        </button>
        <button className="no-delete-button" onClick={closeModal}>
            No (Keep Spot)
        </button>
    </div>
  )
}
