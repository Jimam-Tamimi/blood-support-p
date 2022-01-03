 import {
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    REFRESH_TOKEN_SUCCESS,
    LOGOUT,
} from './types'

const auth = JSON.parse(localStorage.getItem('auth'))
let initialState = {}
if(auth){ 
    initialState = {
        access: auth?.access || null,
        refresh: auth?.refresh || null,
        isAuthenticated: auth?.isAuthenticated || false,
        user: auth?.user || null
    } 
} else {
    initialState = {
        access: auth?.access || null,
        refresh: auth?.refresh || null,
        isAuthenticated: auth?.isAuthenticated || false,
        user: null
    }
} 


const authReducer = (state=initialState, action) => {
    if(action.type === "LOGIN_SUCCESS") {
        console.log(action)
        const { access, refresh, id } = action.payload
        state = {
            ...state,
            access: access,
            refresh: refresh,
            isAuthenticated: true,
            user: id
        }
        localStorage.setItem('auth', JSON.stringify(state))
        console.log(state)
        return state
    }
    else {
        return state
    }
}

export default authReducer