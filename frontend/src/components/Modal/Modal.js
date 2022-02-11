import React, { useState, useRef, useEffect, ReactDOM } from "react";
import {
  ModalWrap,
  ModalContainer,
  ModalHead,
  ModalHeadTitle,
  CloseIconWrap,
  ModalBody,
  ModalFooter,
} from "./Modal.styles";
import { IoClose } from "react-icons/io5";

import { Button } from "../../styles/Essentials.styles";
import Transition from "../Transition/Transition";

export default function Modal({
  btnText,
  style,
  wrapStyle,
  info,
  formId,
  sm,
  md,
  lg,
  title,
  actionText,
  children,
  fade=true ,
  leftToRight,
  rightToLeft,
  topToBottom,
  bottomToTop,
  scale,
  zoom,
  top,
  center,
  bottom,
  buttonInfo,
  buttonPrimary,
  closeOnOutsideClick=true,
  unMountOnHide=false,
  show,
  setShow
}) {
  const refCont = useRef(null);
 
  const showModal = (e) => {
    console.log("open modal");
    setShow(true);
  };

  const listener = (e) => {  
    if (refCont.current && !refCont?.current?.contains(e.target) && closeOnOutsideClick) {
      setShow(false);
    }  
  };

  useEffect(() => {
    if (show) {
      window.addEventListener("click", listener);
      return () => {
        window.removeEventListener("click", listener);
      };
    }
  }, [show]);

  return (
    <>

      <ModalWrap style={wrapStyle} top={top} center={center} bottom={bottom} show={show}>
        <ModalContainer scale sm={sm} md={md} lg={lg} ref={refCont}>
          <Transition
            timeout={200}
            show={show}
            fade={fade}
            leftToRight={leftToRight}
            rightToLeft={rightToLeft}
            topToBottom={topToBottom}
            bottomToTop={bottomToTop}
            scale={scale}
            zoom={zoom}
            style={{width:'100%'}}
            unMountOnHide={unMountOnHide}
          >
            <ModalHead>
              <ModalHeadTitle>{title}</ModalHeadTitle>
              <CloseIconWrap onClick={(e) => setShow(false)}>
                <IoClose></IoClose>
              </CloseIconWrap>
            </ModalHead>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
              form={formId}
               md info>
                {actionText}
              </Button>
              <Button
                md
                grey
                style={{ marginRight: "0", marginLeft: "10px" }}
                onClick={(e) => setShow(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </Transition>
        </ModalContainer>
      </ModalWrap>
    </>
  );
}
