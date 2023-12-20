import { useDispatch, useSelector } from "react-redux"
import { currUserSpotThunk } from "../../store/spots"
import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import SpotCard from "../SpotCard"


export default function CurrentUserSpot() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.session.user)
    const spots = useSelector((state) => state.spots)
    const spotsArr = Object.values(spots)
    return (
        <h1>Current User Spots</h1>
    )
}
