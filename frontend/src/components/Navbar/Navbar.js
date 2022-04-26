import React, { useEffect, useRef, useState } from "react";
import prof from "../../assets/img/prof.jpg";

import { IoMdLogOut } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";

import Switch from "react-switch";

import {
  NavbarWraper,
  NavSearchForm,
  SearchInp,
  Submit,
  NavEndSection,
  NavLogout,
  DropDownHeading,
  NavMessage,
  NavMessageWrap,
  NavMessageCont,
  Message,
  ProfImg,
  MsgInfo,
  Name,
  Msg,
  NavNotificationWrap,
  NavNotification,
  Notification,
  NotImg,
  NotMsg,
  HambBurgerWrap,
  HambBurgerLine,
  ModeWrap,
} from "./Navbar.styles";
import { NavNotificationCont } from "./Navbar.styles";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../redux";
import { CSSTransition } from "react-transition-group";
import Transition from "../Transition/Transition";
import { logOut } from "../../redux/auth/actions";
import { useLocation } from "react-router-dom";
import { getMyContacts, getNotifications, readAllNewMessages, readAllNotifications, unReadNotificationsCount } from "../../apiCalls";
import { BeatLoader, PropagateLoader } from 'react-spinners'
import InfiniteScroll from 'react-infinite-scroller';
import { GetNotificationJSX } from "../../helpers";
import updateInitialFrontendData from "../../redux/initialFrontendData/actions";


export default function Navbar({ toggleDash, setDarkMode, darkMode, show }) {
  // redux
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message);
  const location = useLocation()


  const auth = useSelector((state) => state.auth);
  const initialData = useSelector((state) => state.initialData);


  const msgRef = useRef(null);
  const notRef = useRef(null);

  const [unreadNotCount, setUnreadNotCount] = useState(null)
  const [unreadMsgCount, setUnreadMsgCount] = useState(null)
  const [message, setMessage] = useState(false);
  const [notification, setNotification] = useState(false);

  const handleNavMsgClick = (e, id) => {
    e.preventDefault();
    setMessage(false);
    let equal = false;
    messages?.forEach((val) => {
      if (val === id) {
        equal = true;
      }
    });
    if (!equal) {
      dispatch(addMessage(id));
    }
  };
  useEffect(() => {
    const toggleOpen = (e) => {
      if (!notRef.current?.contains(e.target) && notification) {
        setNotification(false);
      } else if (!msgRef.current?.contains(e.target) && message) {
        setMessage(false);
      }
    };
    window.addEventListener("click", toggleOpen);
    return () => {
      window.removeEventListener("click", toggleOpen);
    };
  }, [notification, message]);

  useEffect(async () => {
    if (notification) {
      const res = await readAllNotifications()
      setUnreadNotCount(0)
    }
  }, [notification])
  useEffect(async () => {
    if (message) {
      const res = await readAllNewMessages()
      if(res.status === 200){
        dispatch(updateInitialFrontendData({ new_message_count: 0}))
      }
    }
  }, [message])

  useEffect(() => {
    unReadNotificationsCount().then(res => {
      setUnreadNotCount(res?.data?.count)
    })
  }, [])


    // window.MESSAGE_WS.onmessage = async (e) => {
    //   const data = JSON.parse(e.data) 
    //   if (data.event === 'message_send_success') {
    //     if(data?.message_from_user != auth.user_id){
    //       dispatch(updateInitialFrontendData({ new_message_count: data.new_message_count}))
    //     }
    //   }  
      
      
    // }
  // useEffect(() => {
  // }, [initialData])

  return (
    <>
      <NavbarWraper show={show}>
        <HambBurgerWrap onClick={toggleDash}>
          <HambBurgerLine />
          <HambBurgerLine />
          <HambBurgerLine />
        </HambBurgerWrap>
        <NavSearchForm>
          <SearchInp placeholder="Search" />
          <Submit>Search</Submit>
        </NavSearchForm>
        <NavEndSection>
          <ModeWrap>
            <Switch
              onChange={() => setDarkMode(!darkMode)}
              checked={darkMode}
              onColor="#2f343a"
              ofColor="rgb(255, 255, 255)"
              onHandleColor="#ffffff"
              handleDiameter={25}
              uncheckedIcon={false}
              checkedIcon={false}
              height={25}
              width={45}
            />
          </ModeWrap>

          {
            !location.pathname.startsWith("/messages") &&
            <NavMessageWrap>
              <NavMessage
                onClick={() => {
                  setMessage(!message);
                  setNotification(false);
                }}
                count={initialData?.new_message_count}

              >
                <BiMessageRoundedDots />
              </NavMessage>

              <Transition
                style={{ position: "absolute", top: "62px", right: "20px" }}
                timeout={200}
                show={message}
                fade
                scale
              >
                <NavMessageCont ref={msgRef} message={true}>
                  {
                    message &&
                    <NavMessageSection showComponent={message} handleNavMsgClick={handleNavMsgClick} />
                  }
                </NavMessageCont>

              </Transition>
            </NavMessageWrap>
          }


          <NavNotificationWrap>
            <NavNotification
              onClick={() => {
                setNotification(!notification);
                setMessage(false);
              }}
              count={unreadNotCount}
            >
              <IoNotificationsOutline />
            </NavNotification>
            <Transition
              style={{ position: "absolute", top: "62px", right: "20px" }}
              timeout={200}
              show={notification}
              fade
              scale
            >
              <NavNotificationCont ref={notRef}>
                <NavNotificationSection setUnreadNotCount={setUnreadNotCount} notRef={notRef} />
              </NavNotificationCont>
            </Transition>
          </NavNotificationWrap>
          <NavLogout onClick={e => dispatch(logOut())}>
            <IoMdLogOut />
          </NavLogout>
        </NavEndSection>
      </NavbarWraper>
    </>
  );
}




function NavMessageSection({ handleNavMsgClick, showComponent }) {

  const [contacts, setContacts] = useState(null)
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
      <DropDownHeading> All Messages</DropDownHeading >
      {

        contacts ?

          contacts?.map(contact => (
            <Message
              onClick={(e) => handleNavMsgClick(e, contact.contact_id)}
              to={`/messages/${contact.contact_id}`}
            >
              <ProfImg src={contact.profile_img} />
              <MsgInfo>
                <Name>{contact.name}</Name>
                <Msg>{contact?.last_message_from}: {contact?.last_message}</Msg>

              </MsgInfo>
            </Message>
          )) :
          <PropagateLoader color="var(--loader-color)" css={{ margin: "auto" }} />
      }
    </>
  )
}


function NavNotificationSection({ notRef, setUnreadNotCount }) {
  const [notification, setNotification] = useState(null)

  const getNotificationsData = async () => {
    try {
      const res = await getNotifications();
      console.log(res)
      setNotification({ ...res.data })

    } catch (error) {
      console.log(error);
    }
  }
  const loadMoreNotifications = async () => {
    console.log("first")
    try {
      const res = await getNotifications(notification.next);
      console.log(res)
      setNotification({ ...notification, results: [...notification.results, ...res.data.results], next: res.data.next })

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getNotificationsData()
  }, [])

  useEffect(() => {
    // window.NOTIFICATION_WS.onmessage = (e) => {
    //   const data = JSON.parse(e.data)
    //   if (data.event === "send_notification") {
    //     setNotification({ ...notification, results: [{ notification_data: data.notification_data, timestamp: data.timestamp, is_read: data.is_read }, ...notification.results] })
    //     setUnreadNotCount(prev => prev + 1)
    //   }
    // }
  })



  return (
    <>
      <DropDownHeading>All Notification</DropDownHeading>
      {
        notification ?

          <InfiniteScroll
            pageStart={0}
            loadMore={loadMoreNotifications}
            hasMore={notification.next}
            loader={<BeatLoader key={0} color="var(--loader-color)" margin="10px auto" />}
            useWindow={false}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}

          >
            {
              notification?.results.map((notf, i) => <GetNotificationJSX key={i} notification={notf} />)
            }
          </InfiniteScroll>

          :
          <BeatLoader color="var(--loader-color)" />
      }




    </>
  )
}
