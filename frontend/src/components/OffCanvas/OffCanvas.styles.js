import styled from "styled-components"
import {Flex} from '../../globalStyles'
import {Link} from 'react-router-dom'

export const Wrap = styled.div`
    width: 100vw;
    height: 100vh; 
    position: fixed;
    right: 0;
    top:0; 
    display: flex;
    z-index: -10;
    justify-content: flex-end;
    background: #00000047;
    opacity: 0;
    ${({show}) => show?`
    z-index: 343433;
        opacity: 1;

    `:''}
    

`

export const Container = styled.div`
    width: 70vw;
    height: 100vh;
    position: fixed;
    right: 0;
    top:0;
    background: var(--object-bg-color);
    transform: translateX(100%);
    ${({show}) => show?`
        transform: translateX(0);
    `:''}

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: auto;
    padding:${({padding}) => padding?padding:'' };
    

    @media only screen and (max-width: 800px){
        &{
            width: 85vw;
        }
    }
`
