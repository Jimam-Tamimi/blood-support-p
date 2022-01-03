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


export const signup = (email, password, cpassword) => async dispatch => {
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
            dispatch(alert(`Account created successfully`, 'success'))
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


export const login = (email, password) => async dispatch => {
    const data = { email, password }
    try {
        const headers = {
            'Content-Type': 'application/json',
        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}api/account/token/`, data, headers)
        console.log(res.data)
        const payload = res.data 
        dispatch(alert(`Login successful`, 'success'))
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: payload
        }) 
    } catch (error) {
        console.log(error);
        if (error.response) {
            for (const err in error.response.data) {
                dispatch(alert(`${err}: ${error.response.data[err]}`, 'danger'))
            }
        }
    }
}
 
export const authenticate = () => async dispatch => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    console.log(auth)
    if(auth?.isAuthenticated) {
        let data = { token: auth.access }
        try {
            const headers = {
                'Content-Type': 'application/json',
            }
            const res = await axios.post(`${process.env.REACT_APP_API_URL}api/account/token/verify/`, data, headers)

        } catch (error) {
            console.log(error.response);
            if (error?.response?.status === 401) {
                dispatch(refreshToken())
            }
        }
    }
}

export const refreshToken = () => async dispatch => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    console.log("jimam")
    console.log({refresh: auth.refresh })
    console.log("jimam")
    if(auth?.refresh) {
        let data = { refresh: auth.refresh }
        try {
            const headers = {
                'Content-Type': 'application/json',
            }
            const res = await axios.post(`${process.env.REACT_APP_API_URL}api/account/token/refresh/`, data, headers)
            console.log(res.data)
            if(res.status === 200){

                dispatch({
                    type: 'REFRESH_TOKEN_SUCCESS',
                    payload: res.data
                })
            }
        } catch (error) {
            console.log(error.response);
            if (error?.response?.status === 401) {
                dispatch({type: 'LOGOUT'})
            }
        }
    }
}