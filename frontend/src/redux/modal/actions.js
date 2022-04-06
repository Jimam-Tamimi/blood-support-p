
export const showModalAction = (Component) => async dispatch => { 
    console.log(Component.props.formId)
    dispatch({type: 'SHOW_MODAL', payload: {show: true, Component:Component}})
}

export const hideModalAction = () => async dispatch => {
    dispatch({type: 'HIDE_MODAL', payload: {show: false}})
}