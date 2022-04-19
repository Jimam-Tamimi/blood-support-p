import React, { useEffect, useRef, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'

import {IoSend, IoClose, IoCheckmarkCircleSharp, IoCheckmarkCircleOutline, IoEllipseOutline} from 'react-icons/io5'
import {HiEmojiHappy} from 'react-icons/hi'
import prof from '../../assets/img/prof.jpg'

import 'emoji-mart/css/emoji-mart.css'
import { removeMessage } from '../../redux/messagePop/actions'
import { Picker } from 'emoji-mart'

import { 
    MessageWrapper, 
    MessageHeaderTitle,
    MessageDetails,
    MsgProfImg,
    ProfName,
    CloseIconWrap,
    MessagesDiv,
    SendMessageDiv,
    EmojiMessageDiv,
    EmojiMessage,
    MessageInputBox,
    EmojiWrap,
    PopUpMessage,
} from './MessagePopup.styles'
import Transition from '../Transition/Transition'
import { getContactDetails, getMessagesForContact } from '../../apiCalls'
import { MessageDiv, MessageStatus } from '../../pages/styles/dashboard/Messages.styles'
import { ProfileImg } from '../../styles/Essentials.styles'
import {Message} from '../../pages/styles/dashboard/Messages.styles'

import { v4 as uuidv4 } from 'uuid';


export default function MessageComponent({contactId}) {
    const [contact, setContact] = useState(null)
    const [closeMessageId, setCloseMessageId] = useState(null)
    const [showEmojiOption, setShowEmojiOption] = useState(false)
    const dispatch = useDispatch()
    const handleCloseMessage = id => {
        console.log(id, '34')
        setCloseMessageId(id)
        setTimeout(() => {
            setCloseMessageId(null)
            dispatch(removeMessage(id))

        }, 400);        
    }
    // code for hiding emoji selector on outside click 
    const refCont = useRef(null)
    const listener = e => {
        if (refCont && !refCont?.current?.contains(e.target)) {
            setShowEmojiOption(false) 
        }
    }

    useEffect(() => {
        if(showEmojiOption){
            window.addEventListener("click", listener)
            return () => {
                window.removeEventListener("click", listener)
            }
        }  
    }, [showEmojiOption ])


    // code for sending message
    const [message, setMessage] = useState('')
    
    useEffect( async () => {
        if(contactId){
            console.log({contactId}) 
            try{
                const res = await getContactDetails(contactId)
                console.log(res)
                if(res.status === 200){
                    setContact({...res.data})
                }
            } catch(err){
            } 
        } 
    }, [contactId])
    
    useEffect( async () => { 
    }, [contact])
    



    // for message 

  const [allMessages, setAllMessages] = useState([]);
  const messagesRef = useRef(null);
  const [lastSeenMessage, setLastSeenMessage] = useState(null);
    
  const getMsgsForContact = async (contact_id) => {
    try {
      const res = await getMessagesForContact(contact_id);
      console.log(res)
      setAllMessages(res.data)
      setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        messagesRef.current.style.scrollBehavior = "smooth"; 

      }, 1);
    } catch (error) {
      console.log(error);
    }
  }
 
  useEffect(() => {
    // console.log({contacts})
    if (contactId) {
    //   contacts.find(contact => contact.contact_id == contactId ? setContact({...contact}) : null)
      getMsgsForContact(contactId)
    }
  }, [contactId]);

    useEffect(() => {
        setLastSeenMessage(allMessages.findLast(msg => (msg.status=='seen')))
      }, [allMessages])
    

    
      const sendMessage = (e) => {
        if (message.trim() === "") return;
        const message_id_client = uuidv4();
        setAllMessages([
          ...allMessages,
          {
            "message_id_client": message_id_client,
            "message_from_me": true,
            "status": "sending",
            "message": message,
            "contact": 1,
            "from_user": 1
          }
        ]);
        setMessage("");
        setTimeout(() => {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }, 1);
        // call api to send message
  
        window.MESSAGE_WS.send(JSON.stringify({ event: 'send_message', message: message, contact_id: contactId, message_id_client: message_id_client }))
  
    };
    window.MESSAGE_WS.onmessage = async (e) => {
      const data = JSON.parse(e.data)
      console.log(data)
      if (data.event === 'message_send_success' && data.contact == contactId) {
        if (allMessages.findIndex(message => message.message_id_client === data.message_id_client) !== -1) {
          setAllMessages(allMessages.map(message => (message.message_id_client === data.message_id_client) ?
            {
              "id": data?.message_id_server,
              "message_from_me": data?.message_from_user,
              "status": data?.status,
              "message": data?.message,
              "timestamp": data?.timestamp,
              "contact": 1,
              "from_user": 1
            } : message
          ))
        } else {
          setAllMessages([...allMessages,
          {
            "id": data?.message_id_server,
            "message_from_me": data?.message_from_user,
            "status": data?.status,
            "message": data?.message,
            "timestamp": data?.timestamp,
            "contact": data?.contact,
            "from_user": data?.from_user
          }
          ])
        }
        if(data.status !== 'seen' && data.message_from_user === false) {
  
          window.MESSAGE_WS.send(JSON.stringify({ event: 'update_message_status', message_id: data.message_id_server, status: 'seen' }))
        }
          setTimeout(() => {
            messagesRef.current.scrollTop = messagesRef.current?.scrollHeight;
        }, 1);
      } else if (data.event === "message_status_update") {
        setAllMessages(allMessages.map(message => (message.id === data.message_id_server) ?
            {
              ...message,
              "status": data?.status,
            } : message
          ))
      }
  
  
    }
      
    return (
        <>
        {
            // contact &&
            <MessageWrapper  closeMessageId={closeMessageId} msgId={contact?.contact_id} >
                <MessageHeaderTitle>
                    <MessageDetails>
                        <MsgProfImg src={contact?.profile?.profile_img} />
                        <ProfName to={`/messages/${contact?.contact_id}/`}>{contact?.profile?.name} {contact?.contact_id}</ProfName>
                    </MessageDetails>
                    <CloseIconWrap onClick={() => handleCloseMessage(contact?.contact_id)}>
                        <IoClose />
                    </CloseIconWrap>
                </MessageHeaderTitle>
                <MessagesDiv ref={messagesRef} style={{overflowY: "scroll", padding: '0 0 10px 0'}}  ref={messagesRef}>
                    {allMessages?.map((message, i) => (
                    // <MessageDiv key={i} type={message?.message_from_me ? 'sent' : 'received'}>
                        <PopUpMessage type={message?.message_from_me ? 'sent' : 'received'}>
                        {message?.message}
                        {message?.message_from_me ? (
                            <MessageStatus status={message?.status}>
                            {message?.status === "seen" ? (
                                lastSeenMessage?.id == message?.id ?
                                <ProfileImg src={contact?.profile?.profile_img} size="100%" /> : ''
                            ) : message.status === "delivered" ? (
                                <IoCheckmarkCircleSharp size="100%" />
                            ) : message.status === "sent" ? (
                                <IoCheckmarkCircleOutline size="100%" />
                            ) : message.status === "sending" ? (
                                <IoEllipseOutline size="100%" />
                            ) : (
                                message?.status
                            )}
                            </MessageStatus>
                        ) : (
                            ""
                        )}
                        </PopUpMessage>
                    // </MessageDiv>
                    ))}
                </MessagesDiv>
                <SendMessageDiv>
                    <EmojiWrap ref={refCont} show={showEmojiOption}>
                        <Transition show={showEmojiOption} fade scale>
                            <Picker onClick={(emoji, e) => {setMessage(message + emoji.native)}} style={{position: "relative",  width: "unset" }} set='facebook' />
                        </Transition>
                    </EmojiWrap>
                    <EmojiMessageDiv onClick={e => setShowEmojiOption(!showEmojiOption)}>
                        <HiEmojiHappy  />
                    </EmojiMessageDiv>
              
                    <MessageInputBox onKeyUp={ e => e.keyCode === 13 && sendMessage()}  value={message} onChange={e=> setMessage(e.target.value)} placeholder="Message" />
                    <EmojiMessageDiv onClick={sendMessage} >
                        <IoSend />
                    </EmojiMessageDiv>
                </SendMessageDiv>
            </MessageWrapper>  
        }

        </>
    )
}
