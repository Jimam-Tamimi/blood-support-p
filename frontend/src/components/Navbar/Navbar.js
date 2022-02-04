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

export default function Navbar({ toggleDash, setDarkMode, darkMode, show }) {
  // redux
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message);

  const msgRef = useRef(null);
  const notRef = useRef(null);

  const [message, setMessage] = useState(false);
  const [notification, setNotification] = useState(false);

  const handleNavMsgClick = (e, id) => {
    e.preventDefault();
    setMessage(false);
    let equal = false;
    messages.forEach((val) => {
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

          <NavMessageWrap>
            <NavMessage
              onClick={() => {
                setMessage(!message);
                setNotification(false);
              }}
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
                <>
                  <DropDownHeading>All Messages</DropDownHeading>
                  <Message
                    onClick={(e) => handleNavMsgClick(e, 1)}
                    to="/msg/rnghef"
                  >
                    <ProfImg src={prof} />
                    <MsgInfo>
                      <Name>Jimam Tamimi 1</Name>
                      <Msg>Jimam Is A Very Good Boy</Msg>
                    </MsgInfo>
                  </Message>
                  <Message
                    onClick={(e) => handleNavMsgClick(e, 2)}
                    to="/msg/rnghef"
                  >
                    <ProfImg src={prof} />
                    <MsgInfo>
                      <Name>Jimam Tamimi 2</Name>
                      <Msg>Jimam Is A Very Good Boy</Msg>
                    </MsgInfo>
                  </Message>
                  <Message
                    onClick={(e) => handleNavMsgClick(e, 3)}
                    to="/msg/rnghef"
                  >
                    <ProfImg src={prof} />
                    <MsgInfo>
                      <Name>Jimam Tamimi 3</Name>
                      <Msg>Jimam Is A Very Good Boy</Msg>
                    </MsgInfo>
                  </Message>
                  <Message
                    onClick={(e) => handleNavMsgClick(e, 4)}
                    to="/msg/rnghef"
                  >
                    <ProfImg src={prof} />
                    <MsgInfo>
                      <Name>Jimam Tamimi 4</Name>
                      <Msg>Jimam Is A Very Good Boy</Msg>
                    </MsgInfo>
                  </Message>
                  <Message
                    onClick={(e) => handleNavMsgClick(e, 5)}
                    to="/msg/rnghef"
                  >
                    <ProfImg src={prof} />
                    <MsgInfo>
                      <Name>Jimam Tamimi 5</Name>
                      <Msg>Jimam Is A Very Good Boy</Msg>
                    </MsgInfo>
                  </Message>
                  <Message
                    onClick={(e) => handleNavMsgClick(e, 6)}
                    to="/msg/rnghef"
                  >
                    <ProfImg src={prof} />
                    <MsgInfo>
                      <Name>Jimam Tamimi 6</Name>
                      <Msg>Jimam Is A Very Good Boy</Msg>
                    </MsgInfo>
                  </Message>
                </>
              </NavMessageCont>
            </Transition>
          </NavMessageWrap>
          <NavNotificationWrap>
            <NavNotification
              onClick={() => {
                setNotification(!notification);
                setMessage(false);
              }}
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
                <DropDownHeading>All Notification</DropDownHeading>

                <Notification to="/msg/rnghef">
                  <NotImg src={prof} />
                  <MsgInfo>
                    <NotMsg>Jimam Is A Very Good Boy</NotMsg>
                  </MsgInfo>
                </Notification>
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
