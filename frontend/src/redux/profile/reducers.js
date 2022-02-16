

const  initialState = {
    isCompleted: true, 

}


const profileReducer = (state=initialState, action) => {
    const { type, payload } = action
    if(type === 'GET_PROFILE_DETAILS'){
        return {
            isCompleted: payload.isCompleted,
            ...payload
        }
    } else if(type === 'PROFILE_DOES_NOT_EXIST'){
        return {
            isCompleted: false,
            ...payload
        }
    } else{
        return state
    }
} 

export default profileReducer