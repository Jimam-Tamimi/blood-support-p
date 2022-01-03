import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import prof from '../../assets/img/prof.jpg'
 

import { removeMessage } from '../../redux/messagePop/actions'
import Message from './Message'


import { 
    MessageCont,

} from './MessagePopup.styles'

export default function MessagePopup() {
    const [msgFullScreen, setMsgFullScreen] = useState(null)

    const message = useSelector(state => state.message)
    const dispatch = useDispatch()
    const msgPops = []
    message.map(id =>{
        // get user data from messsage id from api 
        msgPops.push({
            id: id,
            name: 'Jimam Tamimi',
            image: prof,
            profileId: 23232,
        })
    })
    const handleMessageFullscreen = id => {
        console.log('clicked')
        setMsgFullScreen(id)
    }
    

    return (
        <>
            <MessageCont >
                {

                    msgPops.map(({id, name, image, profileId}) => {
                        
                        return  <Message key={id} id={id} name={name} image={image} profileId={profileId} />
                        
                    })
                }
                
                
            </MessageCont>
            
        </>
    )
}
