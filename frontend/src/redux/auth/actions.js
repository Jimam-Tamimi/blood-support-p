import axios from 'axios'
import { setProgress } from '../progress/actions'
import alert from '../alert/actions'


export const signup = (email, password, cpassword, callback) => async dispatch => {
    console.log(`${process.env.REACT_APP_API_URL}api/account/users/`)
    const data = { email, password, cpassword }
    try {
 
        const res = await axios.post(`${process.env.REACT_APP_API_URL}api/account/users/`, data)
        console.log(res.data)
        const payload = res.data
        if (payload.success) {
            dispatch(alert(`Account created successfully`, 'success'))
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: payload
            })
            callback()
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


export const login = (email, password, callback) => async dispatch => {
    const data = { email, password }
    dispatch(setProgress(20))
    try {
 
        const res = await axios.post(`${process.env.REACT_APP_API_URL}api/account/token/`, data)
    dispatch(setProgress(60))
        console.log(res.data)
        const payload = res.data 
        dispatch(alert(`Login successful 😀`, 'success'))
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: payload
        }) 
        callback()
    } catch (error) {
        console.log(error);
        if (error.response) {
            for (const err in error.response.data) {
                dispatch(alert(`${err}: ${error.response.data[err]}`, 'danger'))
            }
        } else {
            dispatch(alert(`Failed to login 😐`, 'danger'))
        }
    }
    dispatch(setProgress(100))

}
 
export const authenticate = () => async dispatch => {
    const auth = JSON.parse(localStorage.getItem('auth')) 
    if(auth?.isAuthenticated) {
        let data = { token: auth.access }
        try {
 
            await axios.post(`${process.env.REACT_APP_API_URL}api/account/token/verify/`, data)

        } catch (error) {
            console.log(error.response);
            if (error?.response?.status === 401) {
                dispatch(refreshToken())
            } else {
                dispatch({type: 'LOGOUT'})
            }
        }
    }
}

export const refreshToken = () => async dispatch => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    if(auth?.refresh) {
        let data = { refresh: auth.refresh }
        try {

            const res = await axios.post(`${process.env.REACT_APP_API_URL}api/account/token/refresh/`, data)
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
export const logOut = () => async dispatch => {
    dispatch(setProgress(30))
   dispatch({type: 'LOGOUT'})
   dispatch(alert(`Successfully Logged out 😀`))
   setTimeout(() => {
       dispatch(setProgress(100))
   }, 200);
   window.location = '/'
}