import { ADD_MESSAGE, REMOVE_MESSAGE } from "./types"



let messagesId = localStorage.getItem('messagesId')
if(messagesId === null || messagesId === ''){
    messagesId = []
}
else{
    messagesId = messagesId.split(',')
}
const initialState = messagesId.map(id =>  parseInt(id))


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
            localStorage.setItem('messagesId', msgIdAdd)
            return msgIdAdd

        
        case REMOVE_MESSAGE:  
            let msgIdRem = state.filter(id => id!==payload.id)
            localStorage.setItem('messagesId', msgIdRem)
            return msgIdRem

        default: return state
    }
} 

export default messageReducer