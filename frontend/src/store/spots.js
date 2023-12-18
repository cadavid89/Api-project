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
