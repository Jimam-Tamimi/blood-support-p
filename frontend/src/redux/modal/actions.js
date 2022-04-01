
export const showModalAction = (formId, data) => async dispatch => {
    dispatch({type: 'SHOW_MODAL', payload: {show: true, formId: formId, data:data}})
}

export const hideModalAction = () => async dispatch => {
    dispatch({type: 'SHOW_MODAL', payload: {show: false}})
}