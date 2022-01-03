import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import alert from '../../redux/alert/actions'

export default function  VerifyEmail({match})  {
    console.log(match.params)
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    console.log(auth.access)
    if(match.params.id) { 

            const config = {
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${auth.access}`,
                    'Accept': 'application/json'
                }
            }
            axios.get(`${process.env.REACT_APP_API_URL}api/account/verify/${match?.params?.id}/`, config).then(res => {
                dispatch(alert('Your email has been successfully verified', 'success'))
                console.log(res)
            }).catch(err => {
                console.log(err?.response)
                
                if(err?.response?.status){
                    dispatch(alert('', 'danger'))
                }
            })
    }

    return (
        <>
            ferfer
        </>
    )
}
