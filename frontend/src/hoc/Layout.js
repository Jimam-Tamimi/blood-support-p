import React, { useContext, useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import Navbar from "../components/Navbar/Navbar";
import Modal from "../components/Modal/Modal";
import { Container, Wrapper } from "../globalStyles";
import { useState } from "react";
import GlobalStyle from "../globalStyles";
import MessagePopup from "../components/MessagePopup/MessagePopup";

import PrivateComponent from "./PrivateComponent";
import GuestComponent from "./GuestComponent";
import AlertComponent from "../components/Alert/AlertComponent";

import styled from "styled-components";
import { ConfigContext } from "../context/DesignConfig";
import { useDispatch, useSelector } from "react-redux";
import { hideModalAction } from "../redux/modal/actions";
import ReportForm from "../components/ReportForm";

export default function Layout({ children }) {
  const designConfig = useContext(ConfigContext);
  const { darkMode, setDarkMode, show, setShow, smallDevice, setSmallDevice } =
    designConfig;

  const toggleDash = () => {
    setShow(!show);
  };

  const toggleDashOnSmallDevice = () => {
    if (smallDevice) {
      setShow(!show);
    }
  };

  window.addEventListener("resize", () => {
    let width = window.innerWidth;
    if (width <= 748) {
      setSmallDevice(true);
      setShow(false);
    } else {
      setSmallDevice(false);
      setShow(true);
    }
  });

  const dispatch = useDispatch();

  const modal = useSelector((state) => state.modal);
  console.log(modal);

  return (
    <>
      <GlobalStyle darkMode={darkMode} />
      <AlertComponent />
      <Modal
        show={modal.show}
        setShow={(val) => (val === false ? dispatch(hideModalAction()) : "")}
          scale
        formId={modal.formId}>
         <modal.Component formId={modal.formId} data={modal.data} />
      </Modal>

      <PrivateComponent>
        <Wrapper>
          <Dashboard
            toggleDashOnSmallDevice={toggleDashOnSmallDevice}
            show={show}
          />

          <Container
            onClick={() => (smallDevice && show ? setShow(false) : null)}
            smallDevice={smallDevice}
            show={show}>
            <Navbar
              show={show}
              setDarkMode={setDarkMode}
              darkMode={darkMode}
              toggleDash={toggleDash}
            />
            <Content>{children}</Content>
          </Container>
          <MessagePopup />
        </Wrapper>
      </PrivateComponent>
      <GuestComponent>{children}</GuestComponent>
    </>
  );
}

const Content = styled.div`
  width: 96%;
  height: calc(100vh - 80px);

  margin: 25px 0px;
`;
