import React, { useEffect, useState } from 'react'
import { Badge,  ProfileImg } from '../../styles/Essentials.styles'
import { Notification,  NotificationContent, NotificationsWrapper } from '../styles/dashboard/Notifications.styles'
import prof from '../../assets/img/prof.jpg'


export default function Notifications() {

    const [allNotification, setAllNotification] = useState([])

    useEffect(() => {
        // call api to get all notifications
        setAllNotification([...allNotification, {},{},{},{},{},{},{},{},{},{},]);
        // eslint-disable-next-line
    }, [])


    return (
        <>
            <NotificationsWrapper>
                {
                    allNotification.map((notification, i) => (
                        <Notification key={i} to={`/requests/${notification.id}/`}  >
                            <ProfileImg  src={prof} size="65px" />
                            <NotificationContent><b>Jimam Tamimi</b> has accepted your blood request</NotificationContent>
                            <Badge style={{ position: 'absolute', bottom: "10px", right: '10px' }} sm>2 minutes ago</Badge>
                        </Notification>
                    ))
                }


            </NotificationsWrapper>

        </>
    )
}
