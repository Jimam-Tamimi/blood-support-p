import styled from "styled-components";
import {Flex} from '../../globalStyles'


export const Wrap = styled.div`
        position: relative;
        z-index: 12;


`


export const DropdownMenu = styled.div`
    width: 120px;
    padding: 3px 0px;
    position: absolute;
    background: var(--secendory-color);
 
    right: 26px;
 
   
`

 
export const DropdownLink = styled.div`
    width: 100%;
    height: 35px;
    margin: 3px auto;

    padding: 0px 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--secendory-color);
    border-radius: 5px;
    transition: var(--main-transition);
    position: relative;
    z-index: 1;
    cursor: pointer;



    &:hover::after{
        background: var(--secendory-hover-color);
        transform: scaleX(1);
        opacity: 1;
    }
    &:active{
        transform: var(--for-active-click);
    }
    &::after{
        opacity: .6;
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        transition: var(--main-transition);
        transform: scaleX(0);
        z-index: -2;

    }

    &.active{
        background: var(--primary-color) !important;
        color: var(--primary-text-color) !important;
    }
    &.active:hover::after{
        background: var(--primary-hover-color);
        transform: scaleX(1);
    }
   
`
 
 
export const LinkIcon = styled.div`
    width: 30%;
    font-size: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    z-index: 100;
    color: var(--primary-color);

`
 
export const LinkText = styled.div`
    width: 82%;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    z-index: 100;
    color: inherit;
`
 
