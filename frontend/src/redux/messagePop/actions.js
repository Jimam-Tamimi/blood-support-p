import { ADD_MESSAGE, REMOVE_MESSAGE } from './types'

export const addMessage = (id) => {
    return {
        type: ADD_MESSAGE,
        payload: {
            id: id
        }
    }
}

export const removeMessage = (id) => {
    return {
        type: REMOVE_MESSAGE,
        payload: {
            id: id
        }
    }
}


