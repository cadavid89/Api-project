import { allSpotsThunk } from '../../store/spots'
import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'



export default function AllSpots() {
    const dispatch = useDispatch()
    const spotsObj = useSelector(state => state.spots)
    console.log(spotsObj)
    return (
        <>
        <div className="all-spots">
            <h1>All Spots component</h1>
        </div>
        </>
    )
}
