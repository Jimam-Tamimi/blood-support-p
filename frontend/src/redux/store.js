import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
const composeEnhancers = composeWithDevTools({
    trace: true,
});
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk) ));

export default store