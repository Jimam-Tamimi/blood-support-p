

const  initialState = {
    new_messages_count: 0, 


}


const initialDataReducer = (state=initialState, action) => {
    const { type, payload } = action
    if(type === 'UPDATE_INITIAL_DATA'){
        return {
            ...state,
            ...payload,
        }
    } 
    else{
        return state
    }
} 

export default initialDataReducer