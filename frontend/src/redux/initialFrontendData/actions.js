 
const updateInitialFrontendData = (data) => async dispatch => {
    dispatch({type: 'UPDATE_INITIAL_DATA', payload: data})
}

export default updateInitialFrontendData