const progressReducer =  (state = 0, { type, payload }) => {
    if(type === 'SET_PROGRESS') {
        return payload
    } else {
        return state
    }
};

export default progressReducer
