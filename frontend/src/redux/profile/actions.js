import axios from "axios"
import alert from "../alert/actions"


export const getProfileDetails = () => async dispatch => {
    
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}api/account/profile/get-profile-details/`)
        console.log(res)
        dispatch({type: 'GET_PROFILE_DETAILS', payload: res.data})
    } catch (error) {
        if(error.response.status === 404){
            dispatch(alert('Please complete your profile Else you won\'n be able to use every feature 😶', 'warning'))
            dispatch({type: 'PROFILE_DOES_NOT_EXIST' })
        }
        if(error?.response?.status){
        }
        console.log(error)
    }
}