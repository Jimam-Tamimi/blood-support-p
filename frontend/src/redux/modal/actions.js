
export const showModalAction = (formId, data, Component) => async dispatch => {
    console.log(Component)
    dispatch({type: 'SHOW_MODAL', payload: {show: true, formId: formId, data:data, Component:Component}})
}

export const hideModalAction = () => async dispatch => {
    dispatch({type: 'HIDE_MODAL', payload: {show: false}})
}