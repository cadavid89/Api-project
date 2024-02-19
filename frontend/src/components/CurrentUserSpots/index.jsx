import { useDispatch, useSelector } from "react-redux";
import { currUserSpotThunk } from "../../store/spots";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpotCard from "../SpotCard";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import { addSpotImagesThunk } from "../../store/spots";


export default function CurrentUserSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots);
  const spotsArr = Object.values(spots);

    
  useEffect(() => {
    if (user) dispatch(currUserSpotThunk());
  }, [dispatch]);

  if (!user) {
    navigate("/");
  }

  const editSpot = (event, spot) => {
    event.preventDefault();
    navigate(`/spots/${spot.id}/edit`);
  };

  const addSpot = (event) => {
    event.preventDefault();
    navigate("/spots/new");
  };

  return (
    <div className="manage-spots-main-container">
      <div className="manage-spots-header-container">
        <h2>Manage Your Spots</h2>
        <button className="manage-spot-create-button" onClick={addSpot}>
          Create a New Spot
        </button>
      </div>
      <div className="manage-spots-card-container">
        {spotsArr.length > 0 && (
          <div className="manage-spots-cards">
            {spotsArr.map((spot) => (
              <div className="manage-spots-single-card">
                <SpotCard spot={spot} />
                <button
                  className="manage-spot-update-button"
                  onClick={(event) => editSpot(event, spot)}>
                  Update
                </button>
                <OpenModalButton
                  buttonText={"Delete"}
                  modalComponent={<DeleteSpotModal spot={spot} />}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
