import axios from "axios";
import alert from "./redux/alert/actions";
import store from "./redux/store";

// function that takes in an user id and return a promise that resolves to the profile details of the user
export const getProfileDetailsForUser = async (id, showAlert = true) =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/account/profile/get-profile-details-for-user/`,
        { params: { user_id: id } }
      );
      resolve(res);
    } catch (error) {
      if (showAlert) {
        if (error?.response?.status === 404) {
          store.dispatch(alert("Profile not found for this user 😐", "danger"));
        } else {
          store.dispatch(alert("Failed to get profile details 😶", "danger"));
        }
      }
      reject(error);
    }
  });


// function that takes in an blood request id and return a promise that resolves to the blood request details of that blood request id
export const getBloodRequestData = async (id, showAlert = true) => 
  new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/${id}/`
      );
      console.log(res)
      resolve(res);
    } catch (error) {

        reject(error)
      if (showAlert) {
        if (error?.response?.status === 404) {
          store.dispatch(alert("This blood request is not available 😒", "danger"));
        } else if(error?.response?.data?.success === false) {
            store.dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
            store.dispatch(alert("Failed to get blood request details 😕", "danger"));
        }
      }
    }
  });

// function that takes in an blood request id and return a promise that resolves to the blood request details of that blood request id
export const getTotalDonorRequestsForBloodRequest = async (id, showAlert = true) => 
  new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/${id}/get-total-donor-requests-for-blood-request/`
      );
      console.log(res)
      resolve(res);
    } catch (error) {

        reject(error)
      if (showAlert) {
        if (error?.response?.status === 404) {
          store.dispatch(alert("This blood request is not available 😒", "danger"));
        } else if(error?.response?.data?.success === false) {
            store.dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
            store.dispatch(alert("Failed to get total donor request for this blood request 😕", "danger"));
        }
      }
    }
  });

// function that takes in an blood request id and return a promise that resolves to the blood request details of that blood request id
export const getCurrentStatusOfBloodRequestForMe = async (id, showAlert = true) => 
  new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/${id}/get-current-status-of-blood-request-for-me/`
      );
      console.log(res)
      resolve(res);
    } catch (error) {

        reject(error)
      if (showAlert) {
        if (error?.response?.status === 404) {
          store.dispatch(alert("This blood request is not available 😒", "danger"));
        } else if(error?.response?.data?.success === false) {
            store.dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
            store.dispatch(alert("Failed to get status for blood request 😕", "danger"));
        }
      }
    }
  });
