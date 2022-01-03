import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Flex } from "../../../globalStyles";
import { Link } from "react-router-dom";

export const Wrapper = styled.div`
  ${Flex}
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: var(--object-bg-color);
`;

export const ContactsSection = styled.div`
  ${Flex}
  flex-direction: column;
  width: 20%;
  height: 100%;
  max-height: 100%;
  overflow-y: scroll;
  justify-content: flex-start;
  padding-top: 25px;
  border-radius: 10px;
`;
export const Contact = styled(NavLink)`
  ${Flex}
  justify-content: flex-start;
  width: 90%;
  height: 80px;
  min-height: 80px;
  cursor: pointer;
  margin: 5px 0px;
  padding: 5px 10px;
  background: var(--secendory-color);
  &:hover {
    background: var(--secendory-hover-color);
  }
  &.active {
    background: var(--secendory-hover-color);
  }
`;
export const NameAndMsg = styled.div`
  ${Flex}
  flex-direction: column;
  justify-content: space-between;
  margin-left: 15px;
  align-items: baseline;
  height: 65%;
`;

export const MessageSection = styled.div`
  ${Flex}
  flex-direction: column;
  width: 80%;
  height: 100%;
`;

export const MessageWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 10px;
  background: var(--object-bg-color);
  display: flex;
  ${Flex}
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0px 0px 15px 2px var(--main-box-shadow-color);
  ${({ closeMessageId, msgId }) => {
    if (closeMessageId == msgId) {
      return `
                opacity: 0;
                transform: scale(.7) translateY(100%);
            `;
    }
  }}
`;

export const MessageCont = styled.div`
  position: fixed;

  ${Flex}

  padding-bottom: 15px;
  padding-right: 15px;
  right: 0;
  bottom: 0;
`;

export const MessageHeaderTitle = styled.div`
  height: 60px;
  width: 100%;
  ${Flex}
  justify-content: space-between;
  background: var(--primary-color);
  padding: 0 10px;
  z-index: 1;

`;

export const MessageDetails = styled.div`
  ${Flex}
  justify-content: flex-start;
`;

export const ProfName = styled(Link)`
  font-size: 20px;
  font-weight: 500;
  color: var(--primary-text-color);
  margin-left: 10px;
`;

export const ChatOptions = styled.div`
  color: var(--primary-text-color);
  ${Flex}
  padding: 4px;
  border-radius: 100%;
  font-size: 30px;
  cursor: pointer;
  font-size: 25px;

  &:hover {
    background: var(--primary-hover-color);
  }
  &:active {
    transform: var(--for-active-click);
  }
`;

export const MessagesDiv = styled.div`
  height: calc(100% - 110px);
  width: 100%;
  overflow-y: scroll;
  padding-bottom: 10px;
`;

export const SendMessageDiv = styled.div`
  height: 50px;
  width: 100%;
  ${Flex}
  justify-content: space-between;
  position: relative;
`;

export const EmojiMessageDiv = styled.div`
  font-size: 20px;
  color: var(--primary-color);
  ${Flex}
  padding: 5px;
  margin: 0px 5px;
  border-radius: 100%;
  cursor: pointer;
  &:hover {
    background: var(--secendory-hover-color);
  }

  &:active {
    transform: var(--for-active-click);
  }
  z-index: 10;
`;

export const MessageInputBox = styled.input`
  outline: none;
  border: none;
  height: 100%;
  position: absolute;
  background: transparent;
  color: var(--secendory-text-color);
  padding: 0 40px;
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.6px;
  box-shadow: 0px 0px 17px 2px #00000040;
`;

export const EmojiWrap = styled.div`
  position: absolute;
  z-index: 11;
  left: 39px;
  width: 320px;
  bottom: 46px;
`;

export const MessageDiv = styled.div`
  ${Flex}
  width: 100%;
  justify-content: ${({ type }) =>
    type === "sent" ? `flex-end` : `flex-start`};
`;

export const Message = styled.p`
  padding: 10px;
  margin: 5px 0px;

  border-top-right-radius: 20px;

  max-width: 75%;
  color: var(--primary-text-color);
  position: relative;
  ${({ type }) =>
    type === "sent"
      ? `
            margin-right: 25px;
            background: #3e4042;
            border-bottom-left-radius: 20px;
            border-top-left-radius: 10px;
            border-top-right-radius: 20px;

        `
      : type === "received"
      ? `
            border-top-left-radius: 20px;
            border-top-right-radius: 10px;

            background: #0084ff;
            margin-left: 15px;
            border-bottom-right-radius: 20px;
        `
      : ""}
`;

export const MessageStatus = styled.div`
  position: absolute;
  width: 14px;
  height: 14px;
  right: -20px;
  border-radius: 100px;
  bottom: 0px;
`;
