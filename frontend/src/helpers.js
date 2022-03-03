import axios from "axios";
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