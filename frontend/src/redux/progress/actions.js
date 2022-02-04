
export const setProgress = (progress=0) => async dispatch => {
    dispatch({type: 'SET_PROGRESS', payload: progress})
}