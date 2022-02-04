import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import alert from '../../redux/alert/actions'

export default function  VerifyEmail({match})  {
    console.log(match.params)
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    console.log(auth.access)
    const history = useHistory()
    if(match.params.id) { 
            axios.get(`${process.env.REACT_APP_API_URL}api/account/verify/${match?.params?.id}/`).then(res => {
                if(res.status === 200) {
                    dispatch(alert('Your email has been successfully verified', 'success'))
                    history.push('/')
                }
            }).catch(err => {
                if(err.response.status === 404) {
                    dispatch(alert(err?.response?.data?.message, 'danger'))
                } else {
                    dispatch(alert('Failed to verify your account', 'danger'))
                }
                history.push('/')
          
            })
    }

    return (
        <>

        </>
    )
}
