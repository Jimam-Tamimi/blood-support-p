 
 import jwt_decode from "jwt-decode";
console.log(jwt_decode(localStorage.getItem('auth')).user_id );
 
const auth = JSON.parse(localStorage.getItem('auth'))
let initialState = {
        access: auth?.access || null,
        refresh: auth?.refresh || null,
        isAuthenticated: auth?.isAuthenticated || false, 
        user_id: jwt_decode(JSON.parse(localStorage.getItem('auth')).access).user_id || null,
    } 
  
const authReducer = (state=initialState, action) => {
    if(action.type === "LOGIN_SUCCESS") {
        console.log(action)
        const { access, refresh } = action.payload
        state = {
            ...state,
            access: access,
            refresh: refresh,
            isAuthenticated: true, 
            user_id: jwt_decode(access).user_id,
        }
        localStorage.setItem('auth', JSON.stringify(state))
        console.log(state)
        return state
    }
    else if (action.type === "LOGOUT") { 
        state = {
            ...state,
            access: null,
            refresh: null,
            isAuthenticated: false, 
            user_id: null
        }
        localStorage.setItem('auth', JSON.stringify(state))
        console.log(state)
        return state
    }
    else if (action.type === "REFRESH_TOKEN_SUCCESS") { 
        const payload = action.payload
        state = {
            ...state,
            access: payload.access,
            refresh: payload.refresh,
            isAuthenticated: true, 
            user_id: jwt_decode(payload.access).user_id,
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