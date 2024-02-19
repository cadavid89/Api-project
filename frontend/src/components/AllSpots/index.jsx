import { useSelector, useDispatch } from 'react-redux'
import { allSpotsThunk } from '../../store/spots'
import React, {useEffect} from 'react'
import SpotCard from '../SpotCard'
import './AllSpots.css'


export default function AllSpots() {
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots)
    const spotArr = Object.values(spots)

    useEffect(() => {
        dispatch(allSpotsThunk())
    }, [dispatch])

    if (!spotArr.length) return null

    return (
       <>
        <div className='all-spots-main-container'>
            {spotArr.map(spot => (
                <div className='single-spot-card'>
                    <SpotCard spot={spot} />
        </div>
            ))}
            </div>
       </>
    )
}
