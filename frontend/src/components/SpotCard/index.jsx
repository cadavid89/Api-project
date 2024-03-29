import { useNavigate } from "react-router-dom";
import React from "react";
import './SpotCard.css'

export default function SpotCard({ spot }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/spots/${spot.id}");
  };

  return (
    <div className="spot-card" title={spot.name} onClick={handleClick}>
      <img className="spot-card-img" src={spot.previewImage} />
      <div className="spot-card-text">
        <span>
          {spot.city}, {spot.state}
        </span>
        <p className="spot-card-reviews">
          <i className="fa-solid fa-star"></i>
          {spot.avgRating}
        </p>
      </div>
      <p className="spot-card-price">${spot.price} night</p>
    </div>
  );
}
