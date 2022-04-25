

const  initialState = {
    new_message_count: 0, 


}


const initialDataReducer = (state=initialState, action) => {
    const { type, payload } = action
    if(type === 'UPDATE_INITIAL_DATA'){
        console.log("first")
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