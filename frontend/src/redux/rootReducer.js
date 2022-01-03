import { combineReducers } from 'redux'
import messageReducer from './messagePop/reducers'
import authReducer from './auth/reducer'
import alertReducer from './alert/reducer'
import loaderReducer from './loader/reducre' 


const rootReducer = combineReducers({
    message: messageReducer,
    auth: authReducer,
    alerts : alertReducer,
    loader: loaderReducer, 
})

export default rootReducer