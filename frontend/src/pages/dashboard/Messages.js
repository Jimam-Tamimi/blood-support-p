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
import {  ProfileImg } from "../../styles/Essentials.styles";
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

import profile from "../../assets/img/prof.jpg";
// import prof from "../../assets/img/prof.jpg";
import { FaBan } from "react-icons/fa";
import axios from 'axios'
import { useSelector } from "react-redux";
import { getMessagesForContact, getProfileDetailsForUser } from "../../apiCalls";

export default function Messages({ match }) {
  const auth = useSelector(state => state.auth);
  
  
  const [contacts, setContacts] = useState([])
  const getMyContacts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/message/get-my-contacts/`);
      setContacts(res.data.contacts)
      
    } catch (error) {
      console.log(error);
    }
  }
  

  useEffect(() => {
    getMyContacts()
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
        <Route path="/messages/:id/" component={MessagesSection}></Route>
      </Wrapper>
    </>
  );
}

function MessagesSection({ match }) {
  const messagesRef = useRef(null);

  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [showEmojiOption, setShowEmojiOption] = useState(false);
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
    if (e.keyCode === 13) {
      if (message.trim() === "") return;
      setAllMessages([
        ...allMessages,
        { id: 23, type: "sent", status: "sending", message: message },
      ]);
      setMessage("");
      setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 1);
      // call api to send message
    }
  };

  useEffect(() => {
    // setAllMessages([
    //   { id: 23, type: "sent", status: "seen", message: "My name is jimam" },
    //   { id: 23, type: "sent", status: "seen", message: "My name is jimam" },

    //   {
    //     id: 23,
    //     type: "sent",
    //     status: "delivered",
    //     message: "My name is jimam",
    //   },
    //   {
    //     id: 23,
    //     type: "sent",
    //     status: "delivered",
    //     message: "My name is jimam",
    //   },
    //   { id: 23, type: "sent", status: "sent", message: "My name is jimam" },
    //   { id: 23, type: "received", status: "seen", message: "My name is jimam" },
    //   { id: 23, type: "received", status: "seen", message: "My name is jimam" },
    //   { id: 23, type: "sent", status: "sending", message: "My name is jimam" },
    // ]);

    getMsgsForContact(match.params.id)
  }, [match.params.id]);

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
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 1);
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <>
      <MessageSection>
        <MessageWrapper msgId={33}>
          <MessageHeaderTitle>
            <MessageDetails>
              <ProfileImg src={profile} size="45px" />
              <ProfName to={`/profile/34454/`}>Friend</ProfName>
            </MessageDetails>
            <ChatOptions>
              {/* <Dropdown options={chatDropdownOptions}></Dropdown> */}
            </ChatOptions>
          </MessageHeaderTitle>
          <MessagesDiv ref={messagesRef}>
            {allMessages?.map(({ id, type, message, status }) => (
              <MessageDiv key={id} type={type}>
                <Message type={type}>
                  {message}
                  {type === "sent" ? (
                    <MessageStatus status={status}>
                      {status === "seen" ? (
                        <ProfileImg src={profile} size="100%" />
                      ) : status === "delivered" ? (
                        <IoCheckmarkCircleSharp size="100%" />
                      ) : status === "sent" ? (
                        <IoCheckmarkCircleOutline size="100%" />
                      ) : status === "sending" ? (
                        <IoEllipseOutline size="100%" />
                      ) : (
                        ""
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
              onKeyUp={sendMessage}
              placeholder="Message"
            />
            <EmojiMessageDiv>
              <IoSend />
            </EmojiMessageDiv>
          </SendMessageDiv>
        </MessageWrapper>
      </MessageSection>
    </>
  );
}
