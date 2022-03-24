import axios from "axios";
import { setProgress } from "./redux/progress/actions";
import store from "./redux/store";
// import Geocode from "react-geocode";

// Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
// Geocode.setLanguage("en");
// Geocode.setRegion("es");
// Geocode.setLocationType("ROOFTOP");
// Geocode.enableDebug();


export const getCurrentLocation =  (callBack = () => '') => {
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

  if(JSON.stringify(location) === JSON.stringify(myLocation)){
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
  return new Promise( async (resolve, reject) =>  {
    store.dispatch(setProgress(30));
    try {
      console.log('111111')
      let tmpData = [...data]
      await data.sort((a, b) => {
 
        return a.id - b.id
      });
      if(JSON.stringify(tmpData) === JSON.stringify(data)){
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
  return new Promise( async (resolve, reject) =>  {
    store.dispatch(setProgress(30));

    try {
      console.log('111111')
      let tmpData = [...data]
      await data.sort((a, b) => {
 
        return calcDistance(a.location, myLocation) - calcDistance(b.location, myLocation);
      });
      if(JSON.stringify(tmpData) === JSON.stringify(data)){
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
  return new Promise( async (resolve, reject) =>  {
    store.dispatch(setProgress(30));

    try{
      console.log('2222222')
      let tmpData = [...data]
      await data.sort((a,b) =>  new Date(a.date_time) - new Date(b.date_time))
      if(JSON.stringify(tmpData) === JSON.stringify(data)){
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
  { value: "status", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "reviewed", label: "Reviewed" },
  { value: "rejected", label: "Rejected" }, 
]


 