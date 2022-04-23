import styled from 'styled-components'
import {DashLink} from '../Dashboard/Dashboard.styles'


export const NavbarWraper = styled.header`
    padding: 0px 30px 0px 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    box-shadow: 0px 1px 7px 0px var(--main-box-shadow-color);
    background: var(--main-bg-color); 
    position: sticky;
    top: 0;
    z-index: 1;
`

export const NavSearchForm = styled.form`
    margin-right: auto;
`

export const SearchInp = styled.input`
    padding: 10px 10px;
    border-radius: 4px;
    background: var(--secendory-color);
    border: none;
    outline: none;
    color: var(--secendory-text-color);
`

export const Submit = styled.button`
    padding: 9px 7px;
    color: var(--primary-text-color);
    background: var(--primary-color);
    border: none;
    border-radius: 4px;
    margin-left: 5px;
    cursor: pointer;
    transition: all .4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    &:hover{
        background: var(--primary-hover-color);
    }
`

export const NavEndSection = styled.div`

    display: flex;
    justify-content: space-between;
    align-items: center;


`


export const NavMessage = styled.div`
    background: var(--secendory-color);
    margin: 0px 5px;
    border-radius: 60%;
    font-size: 20px;
    cursor: pointer;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    color: var(--secendory-text-color);
    &:hover{
        background: var(--secendory-hover-color);
    }
    &:active{
        transform: var(--for-active-click);
    }
`

export const NavMessageWrap = styled.div`
    position: relative;
`


export const NavNotificationWrap = styled(NavMessageWrap)``

export const NavNotification = styled(NavMessage)``

export const DropDownHeading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 4px 0px 15px 0px;
    font-size: 20px;
    color: var(--secendory-text-color);
`



export const NavMessageCont = styled.div`
 
    width: 330px;
    height: 85vh;
    background: var(--object-bg-color);
    border-radius: 3px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding-top: 10px;
    overflow-y: scroll;
    transition: var(--main-transition);
 
    
`

export const Message = styled(DashLink)`
    display: flex;
    height: auto;
    padding: 10px 10px;
    justify-content: flex-start;
    min-height: 80px;

    color: var(--secendory-text-color);
    z-index: 1000;
    &.active{
        background: var(--secendory-hover-color);
        color: var(--secendory-text-color);
        
    }
    &::after{
        background: var(--secendory-hover-color);
    }
    &.active:hover::after{
        background: var(--secendory-hover-color);
    }
`
export const Notification = styled(Message)`
 
`


export const MsgInfo = styled.div`
    
`
export const Name = styled.h4`
    font-size: 20px;
    font-weight: 600;

`
export const Msg = styled.p`
    font-size: 13px;
    margin-top: 3px;
    font-weight: 500;

`
export const MsgElm = styled.div`


`

export const ProfImg = styled.img`
    min-width: 55px;
    border-radius: 100%;
    object-fit: cover;
    max-height: 55px;
    margin-right: 12px;
`

export const NavNotificationCont = styled(NavMessageCont)`
 
`
export const NotImg = styled(ProfImg)``
export const NotMsg = styled(Msg)`
    font-size: 15px;
    margin-top: 0px;
    font-weight: 500;
    b {
    font-weight: 600;

    }
`

export const NavLogout = styled(NavMessage)``


export const HambBurgerWrap = styled.div`
    margin-right: 25px;
    cursor: pointer;
    & > div{
        background: var(--secendory-text-color);
    }
    &:hover > div{
        background: var(--secendory-text-color);
    }
    &:active{
        transform: var(--for-active-click);
    }
`

export const HambBurgerLine = styled.div`
    width: 26px;
    height: 3px;
    background: white;
    margin: 6px 0px;
    transition: all .4s cubic-bezier(0.25, 0.46, 0.45, 0.94);


`



export const ModeWrap = styled.div`
    margin-right: 20px;
    position: relative;
    top: 3.69px;
    margin-right: 12px;

`