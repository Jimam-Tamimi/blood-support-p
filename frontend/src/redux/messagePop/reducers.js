import { ADD_MESSAGE, REMOVE_MESSAGE } from "./types"


 
const initialState = JSON.parse(localStorage.getItem('messagesId'))


const messageReducer = (state=initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ADD_MESSAGE: 
            let msgIdAdd = [
                ...state,
                payload.id
            ]
            while(msgIdAdd.length > 3 ){
                msgIdAdd.shift()
            }
            localStorage.setItem('messagesId', JSON.stringify(msgIdAdd))
            return msgIdAdd

        
        case REMOVE_MESSAGE:  
            console.log(state)
            let msgIdRem = state.filter(id => id!==payload.id)
            console.log(msgIdRem, "25")
            localStorage.setItem('messagesId', JSON.stringify(msgIdRem))
            return msgIdRem

        default: return state
    }
} 

export default messageReducer