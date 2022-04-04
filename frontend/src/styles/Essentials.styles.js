import { Link } from "react-router-dom";
import styled from "styled-components";
import { Flex } from "../globalStyles";


export const IconDiv = styled.div`
  background: ${({ background }) =>
    background ? background : " var(--secendory-color)"};
  margin: 0px 5px;
  border-radius: 60%;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : "22px")};
  cursor: pointer;
  width: ${({ width }) => (width ? width : "45px")};
  height: ${({ height }) => (height ? height : "45px")};
  color: var(--secendory-text-color);
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${({ hover }) =>
      hover ? hover : "var(--secendory-hover-color)"};
    ${({ scaleOnHover }) =>
      scaleOnHover
        ? `
          transform: var(--hover);
          `
        : ""}
  }

  &:active {
    transform: var(--for-active-click);
  }
`;

export const Button = styled.button`
  padding: 12px 20px;
  font-size: 16px;

  color: var(--primary-text-color);

  border: none;
  border-radius: 4px;
  margin: 0px 5px;
  cursor: pointer;
  transition: var(--main-transition);
  ${({ sm }) =>
    sm
      ? `
        padding: 9px 7px;
        font-size: 13.33px;
      `
      : ""}
  ${({ md }) =>
    md
      ? `
      padding: 11px 17px;
        font-size: 14px;
      `
      : ""}
    ${({ blockOnSmall }) =>
    blockOnSmall
      ? `
        @media only screen and (max-width: 748px) {
          &{
            width: 100%;
          }
        }
      `
      : ""}
    ${({ disabled }) =>
    disabled
      ? `
      opacity: .5;
    cursor: not-allowed;
    pointer-events: none;
      `
      : ""}

  background: var(--primary-color);
  &:hover {
    background: var(--primary-hover-color);
  }
  
  &:active {
    transform: var(--for-active-click);
  }

  ${({ info }) =>
    info
      ? `
        background: var(--info-color);
        &:hover{
          background: var(--info-hover-color);
        }
        
      `
      : ""}

  ${({ grey }) =>
    grey
      ? `
        background: #6b6c75;
        &:hover{
          background: #5c5d60;
        }
        
      `
      : ""}

 
      
`;

export const ButtonLink = styled(Link)`
  padding: 12px 20px;
  font-size: 16px;

  color: var(--primary-text-color);

  border: none;
  border-radius: 4px;
  margin: 0px 5px;
  cursor: pointer;
  transition: var(--main-transition);
  ${({ sm }) =>
    sm
      ? `
        padding: 9px 7px;
        font-size: 13.33px;
      `
      : ""}
  ${({ blockOnSmall }) =>
    blockOnSmall
      ? `
        @media only screen and (max-width: 748px) {
          &{
            width: 100%;
          }
        }
      `
      : ""}

  background: var(--primary-color);
  &:hover {
    background: var(--primary-hover-color);
  }

  &:active {
    transform: var(--for-active-click);
  }

  ${({ info }) =>
    info
      ? `
        background: var(--info-color);
        &:hover{
          background: var(--info-hover-color);
        }
        
      `
      : ""}
`;

export const Badge = styled.span`
  background: var(--primary-color);
  width: max-content;
  /* z-index: 1; */

  border-radius: 7px;
  padding: 4px 6px;

  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.8px;
  color: white;
  transition: var(--main-transition) !important;
  ${({ info, danger, transparent }) =>
    info
      ? `
        background: var(--info-color);       
      `
      : danger? `background: var(--primary-color);` : transparent ? 'background: transparent;' : ''}
  ${({ sm }) =>
    sm
      ? `
        border-radius: 4px;
        padding: 2px 7px;
        font-size: 12px;
        font-weight: 600;      
      `
      : ""}
`;


export const ProfileImg = styled.img` 
    width: ${({size, width=null}) => width==null?size:width};
    height: ${({size, height=null}) => height==null?size:height};
    border-radius: 100%;
    object-fit: cover;
`
   

// for off canvas information

export const ButtonDiv = styled.div`
  ${Flex}
  margin: 10px 0px;
  & > button  {
    ${({disabled}) => disabled?`pointer-events: none; opacity: 0.4; cursor: not-allowed; `:''}
  }

`




export const Profile = styled(Link)`
    ${Flex}
    justify-content: space-between;
    margin: 5px 0px;
    margin-left: 10px; 
`


export const Heading = styled.h3`
  font-size: ${({ fontSize }) => (fontSize ? fontSize : "22px")};
  color: var(--primary-text-color);
`