import { combineReducers } from 'redux'
import messageReducer from './messagePop/reducers'
import authReducer from './auth/reducer'
import alertReducer from './alert/reducer'
import loaderReducer from './loader/reducre' 
import progressReducer from './progress/reducer'


const rootReducer = combineReducers({
    message: messageReducer,
    auth: authReducer,
    alerts : alertReducer,
    loader: loaderReducer, 
    progress: progressReducer,
})

export default rootReducer