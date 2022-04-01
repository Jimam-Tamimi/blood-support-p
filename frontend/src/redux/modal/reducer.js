const initialState = {
    show: false, 
}


const modalReducer =  (state = initialState,  { type, payload }) => {
    if(type === 'SHOW_MODAL') {
        return payload
    } else {
        return state
    }
};

export default modalReducer 