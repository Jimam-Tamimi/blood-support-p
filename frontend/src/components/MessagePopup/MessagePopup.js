import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { getContactDetails } from '../../apiCalls'
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

    const handleMessageFullscreen = id => {
        console.log('clicked')
        setMsgFullScreen(id)
    } 

    return (
        <>
            <MessageCont >
                {

                    message?.map((contactId, i) => (
                        
                          <Message key={contactId} contactId={contactId} />
                        
                    ))
                }
                
                
            </MessageCont>
            
        </>
    )
}
