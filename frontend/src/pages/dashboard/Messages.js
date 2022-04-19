import React, { useEffect, useRef, useState } from "react";
import {
  Contact,
  ContactsSection,
  EmojiMessageDiv,
  EmojiWrap,
  MessageDetails,
  MessageHeaderTitle,
  MessageInputBox,
  MessagesDiv,
  MessageSection,
  MessageWrapper,
  NameAndMsg,
  ProfName,
  SendMessageDiv,
  Wrapper,
  MessageDiv,
  Message,
  MessageStatus,
  ChatOptions,
} from "../styles/dashboard/Messages.styles";
import { ProfileImg } from "../../styles/Essentials.styles";
import Dropdown from "../../components/Dropdown/Dropdown";

import { Picker } from "emoji-mart";
import { HiEmojiHappy } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkCircleSharp,
  IoEllipseOutline,
} from "react-icons/io5";
import Transition from "../../components/Transition/Transition";
import { Route } from "react-router";
import {useParams} from 'react-router-dom'

import profile from "../../assets/img/prof.jpg";
// import prof from "../../assets/img/prof.jpg";
import { FaBan } from "react-icons/fa";
import axios from 'axios'
import { useSelector } from "react-redux";
import { getMessagesForContact, getMyContacts, getProfileDetailsForUser } from "../../apiCalls";
import { v4 as uuidv4 } from 'uuid';

export default function Messages({ match }) {
  const auth = useSelector(state => state.auth);


  const [contacts, setContacts] = useState([])
  const getMyContactsData = async () => {
    try {
      const res = await getMyContacts();
      setContacts(res.data.contacts)

    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getMyContactsData()
  }, [])



  return (
    <>
      <Wrapper>
        <ContactsSection>
          {
            contacts.map(contactProfile => (

              <Contact to={`/messages/${contactProfile?.contact_id}/`} activeClassName="active">
                <ProfileImg size="60px" src={contactProfile?.profile_img} />
                <NameAndMsg>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "var(--secendory-text-color)",
                    }}
                  >
                    {contactProfile?.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "300",
                      letterSpacing: '.6px',
                      color: "var(--secendory-text-color)",
                    }}
                  >
                    {contactProfile?.last_message_from}: {contactProfile?.last_message}
                  </p>
                </NameAndMsg>
              </Contact>

            ))
          }
        </ContactsSection>
        <Route path="/messages/:id/" >
          <MessagesSection contacts={contacts}/>
        </Route>
      </Wrapper>
    </>
  );
}

function MessagesSection({ match, contacts }) {
  const params = useParams()
  console.log(params)
  const messagesRef = useRef(null);
  const [lastSeenMessage, setLastSeenMessage] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [showEmojiOption, setShowEmojiOption] = useState(false);
  const [contact, setContact] = useState({})
  
  const refCont = useRef(null);
  const listener = (e) => {
    if (refCont && !refCont?.current?.contains(e.target)) {
      setShowEmojiOption(false);
    }
  };

  useEffect(() => {
    if (showEmojiOption) {
      window.addEventListener("click", listener);
      return () => {
        window.removeEventListener("click", listener);
      };
    }
  }, [showEmojiOption]);

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

      window.MESSAGE_WS.send(JSON.stringify({ event: 'send_message', message: message, contact_id: params.id, message_id_client: message_id_client }))

  };
  window.MESSAGE_WS.onmessage = async (e) => {
    const data = JSON.parse(e.data)
    console.log(data)
    if (data.event === 'message_send_success' && data.contact == params.id) {
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
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
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
  useEffect(() => {
    console.log({contacts})
    if (params.id) {
      contacts.find(contact => contact.contact_id == params.id ? setContact({...contact}) : null)
    }
    getMsgsForContact(params.id)
  }, [params]);

  const chatDropdownOptions = [
    {
      name: "Report",
      icon: FaBan,
      onClick: () => console.log("need to create report function"),
    },
  ];

  const getMsgsForContact = async (contact_id) => {
    try {
      const res = await getMessagesForContact(contact_id);
      console.log(res)
      setAllMessages(res.data)
      setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current?.scrollHeight;
        messagesRef.current.style.scrollBehavior = "smooth"; 

      }, 1);
    } catch (error) {
      console.log(error);
    }
  }
 
  useEffect(() => {
    setLastSeenMessage(allMessages.findLast(msg => (msg.status=='seen')))
  }, [allMessages])
  
  return (
    <>
      <MessageSection>
        <MessageWrapper msgId={33}>
          <MessageHeaderTitle>
            <MessageDetails>
              <ProfileImg src={contact?.profile_img} size="45px" />
              <ProfName to={`/profile/${contact.user_id}/`}>{contact?.name}</ProfName>
            </MessageDetails>
            <ChatOptions>
              {/* <Dropdown options={chatDropdownOptions}></Dropdown> */}
            </ChatOptions>
          </MessageHeaderTitle>
          <MessagesDiv    ref={messagesRef}>
            {allMessages?.map((message, i) => (
              <MessageDiv key={i} type={message?.message_from_me ? 'sent' : 'received'}>
                <Message type={message?.message_from_me ? 'sent' : 'received'}>
                  {message?.message}
                  {message?.message_from_me ? (
                    <MessageStatus status={message?.status}>
                      {message?.status === "seen" ? (
                        lastSeenMessage?.id == message?.id ?
                        <ProfileImg src={profile} size="100%" /> : ''
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
                </Message>
              </MessageDiv>
            ))}
          </MessagesDiv>
          <SendMessageDiv>
            <EmojiWrap showEmojiOption={showEmojiOption} ref={refCont}>
              <Transition show={showEmojiOption} fade scale>
                <Picker
                  onClick={(emoji, e) => {
                    setMessage(message + emoji.native);
                  }}
                  style={{ position: "relative", width: "unset" }}
                  set="facebook"
                />
              </Transition>
            </EmojiWrap>

            <EmojiMessageDiv
              onClick={(e) => setShowEmojiOption(!showEmojiOption)}
            >
              <HiEmojiHappy />
            </EmojiMessageDiv>
            <MessageInputBox
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={ e => e.keyCode === 13 && sendMessage()}
              placeholder="Message"
            />
            <EmojiMessageDiv onClick={sendMessage} >
              <IoSend />
            </EmojiMessageDiv>
          </SendMessageDiv>
        </MessageWrapper>
      </MessageSection>
    </>
  );
}
