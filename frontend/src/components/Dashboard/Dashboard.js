import React, { useEffect, useState } from "react";

import {AiFillDashboard, AiOutlineForm,} from 'react-icons/ai'
import {FaHandsHelping,} from 'react-icons/fa'
import {BiTimer, BiDonateBlood, BiMessageRoundedDetail,} from 'react-icons/bi'
import {GiPlayerPrevious,} from 'react-icons/gi'
import {IoMdNotificationsOutline,} from 'react-icons/io'
import {MdFavoriteBorder,} from 'react-icons/md'
import {CgProfile,} from 'react-icons/cg'
import {FiSettings,} from 'react-icons/fi' 


import logo from '../../assets/img/logo.png'


import { 
    DashboardWrapper, 
    Logo, 
    LogoText, 
    DashLink, 
    LinkIcon,
    LinkText,
    DashboardLogo,
} from "./Dashboard.styles";
import { useSelector } from "react-redux";


export default function Dashboard({show, toggleDashOnSmallDevice}) {
    
    // hooks
    const profile = useSelector(state => state.profile)
    
    
    const dashLinks = [
        {to:"/", name: 'Dashboard', icon: AiFillDashboard,exact: true, count:null },
        {to:"/help-people/", name: 'Help People', icon:FaHandsHelping,exact: true, count:null },
        {to:"/make-request/", name: 'Make Request', icon:AiOutlineForm,exact: true, count:null },
        {to:"/your-blood-requests/", name: 'Your Blood Requests', icon:BiTimer,exact: false, count:null },
        {to:"/your-donor-requests/", name: 'Your Donor Requests', icon:GiPlayerPrevious,exact: false, count:null },

        {to:"/messages/", name: 'Messages', icon:BiMessageRoundedDetail,exact: false, count:44   },
        {to:"/notifications/", name: 'Notifications', icon:IoMdNotificationsOutline,exact: true, count:null },
        {to:"/favorites/", name: 'Favorites', icon:MdFavoriteBorder,exact: true, count:null },

        {to:"/profile/", name: 'Profile', icon:CgProfile,exact: false, count:profile.isCompleted?null: '!' },

        {to:"/settings/", name: 'Settings', icon:FiSettings,exact: true, count:null },
    ]
 
 
    
    

  return (
    <>
      <DashboardWrapper show={show}>
            <DashboardLogo exact to="/">
                <Logo  src={logo}/>
                <LogoText>
                    BloodSupport
                </LogoText>
            </DashboardLogo>
            
            {
                dashLinks.map((link, i) => {
                    return (
                        <>
                        <DashLink  key={i} on Click={() => toggleDashOnSmallDevice()} activeClassName="active"  to={link.to} exact={link.exact} count={link.count}>
                            <LinkIcon>
                                <link.icon/>
                            </LinkIcon>
                            <LinkText>
                                {link.name}
                            </LinkText>
                        </DashLink>
                        </>
                    )
                })
            }

      </DashboardWrapper>
    </>
  );
}
