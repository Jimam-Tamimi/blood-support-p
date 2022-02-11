import axios from "axios";
// import Geocode from "react-geocode";

// Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
// Geocode.setLanguage("en");
// Geocode.setRegion("es");
// Geocode.setLocationType("ROOFTOP");
// Geocode.enableDebug();
 

export const getCurrentLocation = (callBack= () => '') => {
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
