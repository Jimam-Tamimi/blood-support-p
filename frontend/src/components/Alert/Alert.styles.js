import styled, {keyframes} from 'styled-components' 
import { Flex } from '../../globalStyles'

export const AlertAnimation = keyframes`
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }

`


export const AlertCont = styled.div`
    position: fixed;
    ${Flex}
    
    left: 0;
    right: 0;
    margin: auto;
    max-width: fit-content;

    flex-direction: column;

    z-index: 1000000;
    top: unset;
    bottom: 30px;

`

export const AlertCompo = styled.div`
    ${Flex}







    background-color: rgb(21, 21, 21);
    color: white;
    padding: 10px;
    text-transform: uppercase;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: rgb(0 0 0 / 3%) 0px 2px 2px 2px;
    font-family: Arial;
    min-width: 330px;
    box-sizing: border-box;
    margin: 10px;
    padding: 15px 20px;
    animation: ${AlertAnimation} 0.3s ;

`

export const AlertText = styled.p`
        font-weight: 600;
    letter-spacing: 1px;
    color: white;
`

export const AlertClose = styled.div`
     color: ${({alertType}) => alertType=='success'? 'rgb(49, 180, 4)':alertType=='danger'?'rgb(255, 0, 64)':'white'}; 

    font-size: 20px;
    margin-left: 20px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    ${Flex}
    &:hover{
        background: var(--secendory-hover-color);
    }
    &:active{
        transform: var(--for-active-click);
    }

`

