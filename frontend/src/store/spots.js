import { csrfFetch } from "./csrf";

const ALL_SPOTS = 'spots/ALL_SPOTS'

//action
export const getAllSpots = (spots) => {
    return {
        type: ALL_SPOTS,
        spots
    }
}

//thunks
export const allSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    if (res.ok) {
        const spots = await res.json();
        dispatch(getAllSpots(spots))
        return spots
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
        default: {
            return state
        }
    }
}

export default spotReducer
