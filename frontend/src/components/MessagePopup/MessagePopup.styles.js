import styled, {css, keyframes} from "styled-components";

import {Link} from 'react-router-dom'

import {ProfImg} from '../Navbar/Navbar.styles'
import { Message } from "../../pages/styles/dashboard/Messages.styles";

const flex = css`
    display: flex;
    justify-content: center;
    align-items: center;
`

const column = css`
    flex-direction: column;
`

const flexStart = css`
    justify-content: flex-start;
`

const Hover = css`
    &:hover{
        background: var(--secendory-hover-color);
    }

    &:active{
        transform: var(--for-active-click);
    }

`

const msgMount = keyframes`
  from {
    opacity: 0;
    transform: scale(.7) translateY(100%);  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);  }
`;


export const MessageCont = styled.div`
    position: fixed;

    ${flex}

    padding-bottom: 15px;
    padding-right: 15px;
    right: 0;
    bottom: 0;
`


export const MessageWrapper = styled.div`
    width: 300px;
    height: 73vh;
    max-height: 415px;
    min-height: 185px;
    margin: 0 10px;
    background: var(--object-bg-color);
    display: flex;
    ${flex}
    flex-direction: column;
    justify-content: flex-start;
    box-shadow: 0px 0px 15px 2px var(--main-box-shadow-color);
    animation: ${msgMount} .4s linear  1;
    ${({closeMessageId, msgId}) => {
        if(closeMessageId == msgId){
            return `
                opacity: 0;
                transform: scale(.7) translateY(100%);
            `
        }
    }}
   
`

export const MessageHeaderTitle = styled.div`
    height: 60px;
    width: 100%;
    ${flex}
    justify-content: space-between;
    background: var(--primary-color);
    padding: 0 10px;

`

export const MessageDetails = styled.div`
    ${flex}
    justify-content: flex-start;
`


export const MsgProfImg = styled(ProfImg)`
    width: 40px;
    height: 40px;

`

export const ProfName = styled(Link)`
    font-size: 20px;
    font-weight: 500;
    color: var(--primary-text-color);
`

export const CloseIconWrap = styled.div`
    color: var(--primary-text-color);
    ${flex}
    padding: 4px;
    border-radius: 100%;
    font-size: 30px;
    cursor: pointer;
    font-size: 25px;

    &:hover{
        background: var(--primary-hover-color);
    }
    &:active{
        transform: var(--for-active-click);
    }

`

export const MessagesDiv = styled.div`
    height: calc(100% - 110px);
    width: 100%;
    

`

export const SendMessageDiv = styled.div`
    height: 50px;
    width: 100%;
    ${flex}
    justify-content: space-between;
    position: relative;
`

export const EmojiMessageDiv = styled.div`
    font-size: 20px;
    color: var(--primary-color);
    ${flex}
    padding: 5px;
    border-radius: 100%;
    cursor: pointer;
    ${Hover}
    z-index: 10;
`


export const MessageInputBox = styled.input`
    outline: none;
    border: none;
    height: 100%;
    position: absolute;
    background: transparent;
    color: var(--secendory-text-color);
    padding: 0 33px;
    width: 100%;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: .6px;
    box-shadow: 0px 0px 17px 2px #00000040;
`



export const EmojiWrap = styled.div`
    position: absolute; 
    z-index: 11;
    right: -36px;
    width: 100%;
    bottom: 46px;
    ${({show}) => show?`
    transform: scale(1);
    opacity: 1;
    visibility: visible;
    `:`
    transform: scale(0);
    opacity: 0;
    visibility: hidden;
    `}
`



export const PopUpMessage = styled(Message)`

width: fit-content;
font-size: .91rem;
padding: 5px 10px;

${({ type }) =>
    type === "sent"
      ? `
            margin-left: auto;
            background: #3e4042;
            border-bottom-left-radius: 10px;
            border-top-left-radius: 5px;
            border-top-right-radius: 10px;

        `
      : type === "received"
      ? `
            border-top-left-radius: 10px;
            border-top-right-radius: 5px;

            background: #0084ff;
            margin-right: auto;
            border-bottom-right-radius: 10px;
        `
      : ""}

`