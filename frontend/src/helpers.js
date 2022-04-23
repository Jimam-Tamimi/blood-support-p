import axios from "axios";
import { setProgress } from "./redux/progress/actions";
import store from "./redux/store";
import { useHistory, useLocation } from 'react-router-dom';
import { MsgInfo, Notification, NotImg, NotMsg } from "./components/Navbar/Navbar.styles";
import blankProfileImage from "./assets/img/blank-profile-pic.png";
import { useEffect, useState } from "react";
import { getProfileDetailsForUser } from "./apiCalls";
// import Geocode from "react-geocode";

// Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
// Geocode.setLanguage("en");
// Geocode.setRegion("es");
// Geocode.setLocationType("ROOFTOP");
// Geocode.enableDebug();


export const getCurrentLocation = (callBack = () => '') => {
  let coords = { lat: 0, lng: 0 };
  navigator.geolocation.getCurrentPosition(
    (location) => {
      coords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      callBack(coords);
    },
    () => console.log("error :)"),
    { timeout: 10000 }
  );
};

export const getLocationName = async (cords) => {
  // Geocode.fromLatLng("48.8583701", "2.2922926").then(
  //     (response) => {
  //       const address = response.results[0].formatted_address;
  //       console.log(address);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
};



export const getProfileData = async userId => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}api/account/profile/${userId}/get-profile-details-by-user/`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log(error);
    return false
  }
}





export function calcDistance(location, myLocation) {
  // Converts numeric degrees to radians

  if (JSON.stringify(location) === JSON.stringify(myLocation)) {
    return 0
  }
  function toRad(Value) {
    return Value * Math.PI / 180;
  }
  var R = 6371; // km
  var dLat = toRad(myLocation?.lat - location?.lat);
  var dLon = toRad(myLocation?.lng - location?.lng);
  let lat1 = toRad(location?.lat);
  let lat2 = toRad(myLocation?.lat);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toFixed(2);
}


export function sortById(data) {
  return new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(30));
    try {
      console.log('111111')
      let tmpData = [...data]
      await data.sort((a, b) => {

        return a.id - b.id
      });
      if (JSON.stringify(tmpData) === JSON.stringify(data)) {
        resolve(data.reverse());
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
    store.dispatch(setProgress(100));
  })
}

export function sortByDistance(myLocation, data) {
  return new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(30));

    try {
      console.log('111111')
      let tmpData = [...data]
      await data.sort((a, b) => {

        return calcDistance(a.location, myLocation) - calcDistance(b.location, myLocation);
      });
      if (JSON.stringify(tmpData) === JSON.stringify(data)) {
        resolve(data.reverse());
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
    store.dispatch(setProgress(100));

  })
}

export function sortByTime(data) {
  return new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(30));

    try {
      console.log('2222222')
      let tmpData = [...data]
      await data.sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
      if (JSON.stringify(tmpData) === JSON.stringify(data)) {
        resolve(data.reverse());
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }

    store.dispatch(setProgress(100));


  })

}


export const donorRequestFilterOption = [
  { value: "", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Accepted", label: "Accepted" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Rejected", label: "Rejected" },
]



export const bloodFilterOption = [
  { value: "All", label: "All" },
  { value: "Open", label: "Open" },
  { value: "Accepted", label: "Accepted" },
  { value: "Reviewed By Requestor", label: "Reviewed By Requestor" },
  { value: "Completed", label: "Completed" },
  { value: "Expired", label: "Expired" },
]





export const webSocketConnect = () => {
  if (JSON.parse(localStorage.getItem('auth'))?.isAuthenticated) {

    window.USER_WS = new WebSocket(`ws://localhost:8000/ws/account/users/?token=${JSON.parse(localStorage.getItem('auth'))?.access}`);
    window.MESSAGE_WS = new WebSocket(`ws://localhost:8000/ws/message/?token=${JSON.parse(localStorage.getItem('auth'))?.access}`);
    window.NOTIFICATION_WS = new WebSocket(`ws://localhost:8000/ws/notification/?token=${JSON.parse(localStorage.getItem('auth'))?.access}`);

  }
}


export const webSocketDisconnect = () => {

  window.USER_WS.close()
  window.MESSAGE_WS.close()
  window.NOTIFICATION_WS.close()

}



export const messageToUser = async (user_id, history) => {

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}api/message/create-contact/`, { user_id: user_id })
    if (res.status === 200) {
      history.push(`/messages/${res.data.contact_id}/`)
    }
  } catch (error) {
    console.log(error);
  }
}


export const GetNotificationJSX = ({ notification }) => {
  const [data, setData] = useState(null)
  notification = notification.notification_data


  useEffect(async () => {
    if (["NEW_BLOOD_REQUEST", "DONOR_REQUEST_GOT", "BLOOD_REQUEST_UPDATED", "BLOOD_REQUEST_DELETED", "DONOR_REQUEST_ACCEPTED", "DONOR_REQUEST_NOT_ACCEPTED", "DONOR_REQUEST_REJECTED", "DONOR_REQUEST_CANCELED", "DONOR_REQUEST_RESTORED", "DONOR_REQUEST_DELETED", "DONOR_REQUEST_UPDATED", "DONOR_REQUEST_REVIEWED", "BLOOD_REQUEST_REVIEWED",].includes(notification.type)) {
      try {
          if(notification.data.user_id){
            const res = await getProfileDetailsForUser(notification.data.user_id, false) 
            setData({ ...res.data })
          } else {
            throw new Error('Exception');
          }
      }
      catch (error) { 
          setData("error") 
      }
    }
   

  }, [])
  const location = useLocation() 

  return (
    notification.type === "NEW_BLOOD_REQUEST" ?
    <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/`} >
      <NotImg src={data?.profile_img || blankProfileImage} />
      <MsgInfo>
        <NotMsg><b>{data?.name || "A User"}</b> has posted a blood request.</NotMsg>
      </MsgInfo>
    </Notification> 

    : notification.type === "DONOR_REQUEST_GOT" ?
    <Notification activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/donors/?donor-request-id=${notification?.data?.donor_request_id}`}>
      <NotImg src={data?.profile_img || blankProfileImage} />
      <MsgInfo>
        <NotMsg><b>{data?.name || "A User"}</b> has sent you a donor request.</NotMsg>
      </MsgInfo>
    </Notification> 

    : notification.type === "BLOOD_REQUEST_UPDATED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has updated his blood request where you have sent donor request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "BLOOD_REQUEST_DELETED" ?
      <Notification  activeClassName=""  to={`#`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has deleted his blood request where you have sent donor request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "DONOR_REQUEST_ACCEPTED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/donor-request/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has accepted your donor request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "DONOR_REQUEST_NOT_ACCEPTED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/donor-request/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has accepted someone else's donor request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "DONOR_REQUEST_REJECTED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/donor-request/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has rejected your donor request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "DONOR_REQUEST_CANCELED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/donor-request/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has canceled your accepted donor request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "DONOR_REQUEST_RESTORED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/donor-request/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has restored your canceled donor request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "DONOR_REQUEST_DELETED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/donors/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has deleted his donor request from your blood request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "DONOR_REQUEST_UPDATED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.blood_request_id}/donors/?donor-request-id=${notification?.data?.donor_request_id}`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> has updated his donor request.</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "DONOR_REQUEST_REVIEWED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.reviewed_blood_request_id}/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>{data?.name || "A User"}</b> gave you a review as a blood requestor. Please review him to see your review</NotMsg>
        </MsgInfo>
      </Notification> 

    : notification.type === "BLOOD_REQUEST_REVIEWED" ?
      <Notification  activeClassName=""  to={`/requests/${notification?.data?.reviewed_blood_request_id}/`}>
        <NotImg src={data?.profile_img || blankProfileImage} />
        <MsgInfo>
          <NotMsg><b>Your blood request #{notification?.data?.reviewed_blood_request_id} is completed. {data?.name || "A User"}</b> gave you a review as a donor requestor.</NotMsg>
        </MsgInfo>
      </Notification> 

    : ''
  )

}
