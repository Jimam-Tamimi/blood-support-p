import {
    REFRESH_TOKEN_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT
} from './types'
import axios from 'axios'
import alert from '../alert/actions'


export const login = (email, password, cpassword) => async dispatch => {
    console.log(`${process.env.REACT_APP_API_URL}api/account/users/`)
    const data = { email, password, cpassword }
    try {
        const headers = {
            'Content-Type': 'application/json',
        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}api/account/users/`, data, headers)
        console.log(res.data)
        const payload = res.data
        if (payload.success) {
            dispatch(alert(`Login successful`, 'success'))
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: payload
            })
        }
    } catch (error) {
        console.log(error);
        if (error.response) {
            for (const err in error.response.data) {
                dispatch(alert(`${err}: ${error.response.data[err]}`, 'danger'))
            }
        }
    }

}


export const authenticate = (access, refresh) => async dispatch => {
    
}

export const refreshToken = (refresh) => async dispatch => {

}