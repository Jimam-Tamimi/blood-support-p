import { combineReducers } from 'redux'
import messageReducer from './messagePop/reducers'
import authReducer from './auth/reducer'
import alertReducer from './alert/reducer'
import loaderReducer from './loader/reducre' 
import progressReducer from './progress/reducer'
import profileReducer from './profile/reducers'


const rootReducer = combineReducers({
    message: messageReducer,
    auth: authReducer,
    alerts : alertReducer,
    loader: loaderReducer, 
    progress: progressReducer,
    profile: profileReducer,
})

export default rootReducer