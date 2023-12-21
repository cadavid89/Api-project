import { csrfFetch } from "./csrf";

const ALL_SPOTS = 'spots/ALL_SPOTS'
const SINGLE_SPOT = 'spots/SINGLE_SPOT'
const CURR_USER_SPOTS = 'spots/CURR_USER_SPOTS'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const EDIT_SPOT = 'spots/EDIT_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'

//action
 const getAllSpots = (spots) => {
    return {
        type: ALL_SPOTS,
        spots
    }
}

 const getSingleSpot = (spot) => {
    return {
        type: SINGLE_SPOT,
        spot
    }
}

 const getCurrUserSpots = (spots) => {
    return {
        type: CURR_USER_SPOTS,
        spots
    }
}

  const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
  }

  const editSpot = (spot) => {
    return {
        type: EDIT_SPOT,
        spot
    }
  }

  const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
  }

//thunks
export const allSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    if (res.ok) {
        const spots = await res.json();
        dispatch(getAllSpots(spots))
        return spots
    } else {
        const errs = await res.json()
        return errs
    }
}

export const singleSpotThunk = (spotId) => async dispatch => {
    const res = await fetch('/api/spots/${spotId}')
    if (res.ok) {
        const spot = await res.json();
        dispatch(getSingleSpot(spot))
        return spot
    }
}

export const currUserSpotThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current')
    if (res.ok) {
        const spots = await res.json()
        dispatch(getAllSpots(spots))
        return spots
    }
}

export const createSpotThunk = (payload) => async (dispatch) => {
    const res = await csrfFetch('api/spots', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })

    if (res.ok) {
        const spot = await res.json()
        dispatch(createSpot(spot))
    } else {
        const errors = await res.json()
        return errors
    }
}

export const editSpotThunk = (spotId, payload) => async (dispatch) => {
    const res = await csrfFetch('api/spots/${spotId}', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })

    if (res.ok) {
        const spot = await res.json()
        dispatch(editSpot(spot))
    } else {
        const errors = await res.json()
        return errors
    }
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch('api/spots/${spotId}', {
        method: 'DELETE',
    })

    if (res.ok) {
        const deleted = await res.json()
        dispatch(deleteSpot(spotId))
        return deleted
    }
}
//reducer
const spotReducer = (state = {}, action) => {
    switch(action.type) {
        case ALL_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot
            })
            return newState
        }
        case CURR_USER_SPOTS:
            return {state}
        case SINGLE_SPOT:
            return {...state, [action.spot.id]: action.spot}
        case CREATE_SPOT:
            return {...state, [action.spot.id]: action.spot}
        case EDIT_SPOT:
            return {...state, [action.spot.id]: action.spot}
        case DELETE_SPOT:
            const newState= {...state}
            delete newState[action.spotId]
            return newState
        default:
            return state
        }
    }


export default spotReducer
