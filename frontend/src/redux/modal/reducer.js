const initialState = {
    show: false, 
    Component: () => <></>
}


const modalReducer =  (state = initialState,  { type, payload }) => {
    if(type === 'SHOW_MODAL') {
        return payload
    } else if (type === 'HIDE_MODAL') {
        return initialState
    } else {
        return state
    }
};

export default modalReducer 