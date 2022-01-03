import React, { useState, useRef, useEffect } from "react";
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
  info,
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
  buttonPrimary
}) {
  const refCont = useRef(null);

  const [show, setShow] = useState(false);
  const showModal = (e) => {
    console.log("open modal");
    setShow(true);
  };

  const listener = (e) => {
    if (refCont && !refCont?.current?.contains(e.target)) {
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
      <Button onClick={showModal} type="button"  info={buttonInfo} primary={buttonPrimary} style={style}>
        {btnText}
      </Button>
      <ModalWrap top={top} center={center} bottom={bottom} show={show}>
        <ModalContainer scale sm={sm} md={md} lg={lg} ref={refCont}>
          <Transition
            timeout={200}
            show={show}
            show={show}
            fade={fade}
            leftToRight={leftToRight}
            rightToLeft={rightToLeft}
            topToBottom={topToBottom}
            bottomToTop={bottomToTop}
            scale={scale}
            zoom={zoom}
            style={{width:'100%'}}
          >
            <ModalHead>
              <ModalHeadTitle>{title}</ModalHeadTitle>
              <CloseIconWrap onClick={(e) => setShow(false)}>
                <IoClose></IoClose>
              </CloseIconWrap>
            </ModalHead>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button md info>
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
