import React, { useEffect, useState } from "react";
import { Wrap } from "./Transition.styles";

export default function Transition({
  children,
  show = false,
  timeout = 200,
  style,
  fade,
  leftToRight,
  rightToLeft,
  topToBottom,
  bottomToTop,
  scale,
  zoom
}) {
  const [showHere, setShowHere] = useState(show);
  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setShowHere(show);
      }, timeout);
    } else {
      setShowHere(show);
    }
  }, [show]);

  return (
    <>
      <Wrap style={style} timeout={timeout} show={show} fade={fade} leftToRight={leftToRight} rightToLeft={rightToLeft} topToBottom={topToBottom} bottomToTop={bottomToTop} scale={scale} zoom={zoom}  >
        {showHere ? children : ""}
      </Wrap>
    </>
  );
}
