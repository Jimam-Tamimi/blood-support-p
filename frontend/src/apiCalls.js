import axios from "axios";
import alert from "./redux/alert/actions";
import { setProgress } from "./redux/progress/actions";
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
          store.dispatch(alert(`${error?.response?.data?.code === 'profile_not_found'? error?.response?.data?.error : error?.response?.data?.code==='user_not_found' ? error?.response?.data?.error : ''} `, "danger"));
        } else {  
          store.dispatch(alert("Failed to get profile details 😶", "danger"));
        }
      }
      reject(error);
    }
  });


// function that takes in an blood request id and return a promise that resolves to the blood request details of that blood request id
export const getBloodRequestData = async (id, showAlert = true, showProgress= false ) => 
  new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(20));
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
    store.dispatch(setProgress(100));
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

// function that takes in an blood request id and return a promise that resolves to the blood request details of that blood request id
export const getMyDonorRequestStatusForBloodRequest = async (id, showAlert = true) => 
  new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/get-my-donor-request-status-for-blood-request/`, {params: {blood_request_id: id}}
      );
      console.log(res)
      resolve(res);
    } catch (error) {

        reject(error)
      if (showAlert) {
        if (error?.response?.status === 404) {
          store.dispatch(alert("This donor request is not available 😒", "danger"));
        } else if(error?.response?.data?.success === false) {
            store.dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
            store.dispatch(alert("Failed to get status for donor request 😕", "danger"));
        }
      }
    }
  });


  export const searchDonorRequestsForBloodRequest = async (id,value, showAlert = true) => 
  new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(30));
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/filter-donor-request-for-blood-request/?search=${value}`, {params: {blood_request_id: id}}
      ); 
      resolve(res);
    } catch (error) {

        reject(error)
      if (showAlert) {
        if (error?.response?.status === 404) {
          store.dispatch(alert("This blood request is not available 😒", "danger"));
        } else if(error?.response?.data?.success === false) {
            store.dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
            store.dispatch(alert("Failed to get status for donor request 😕", "danger"));
        }
      }
    }
    store.dispatch(setProgress(100));

  });

export const report = async (formData, formId, data, showAlert = true) => 
  new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(30));
    console.log(formId)
    if(formId === "blood-request-report") {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}api/blood/blood-request/${data?.blood_request_id}/report/`, formData
        ); 
        console.log({res})
        resolve(res);
      } catch (error) {
  
          reject(error)
        if (showAlert) {
          if (error?.response?.status === 404) {
            store.dispatch(alert("This blood request is not available 😒", "danger"));
          } else if(error?.response?.data?.success === false) {
              store.dispatch(alert(error?.response?.data?.error, "danger"));
          } else {
              store.dispatch(alert("Failed to  report this blood request 😕", "danger"));
          }
        }
      }
    } else if (formId === "donor-request-report") {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}api/blood/donor-request/${data?.donor_request_id}/report/`, formData
        ); 
        console.log({res})
        resolve(res);
      } catch (error) {
  
          reject(error)
        if (showAlert) {
          if (error?.response?.status === 404) {
            store.dispatch(alert("This donor request is not available 😒", "danger"));
          } else if(error?.response?.data?.success === false) {
              store.dispatch(alert(error?.response?.data?.error, "danger"));
          } else {
              store.dispatch(alert("Failed to  report this donor request 😕", "danger"));
          }
        }
      }
    } else if (formId === "user-report") {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}api/account/users/${data?.user_id}/report/`, formData
        ); 
        console.log({res})
        resolve(res);
      } catch (error) {
  
          reject(error)
        if (showAlert) {
          if (error?.response?.status === 404) {
            store.dispatch(alert("This user is not available 😒", "danger"));
          } else if(error?.response?.data?.success === false) {
              store.dispatch(alert(error?.response?.data?.error, "danger"));
          } else {
              store.dispatch(alert("Failed to report this user 😕", "danger"));
          }
        }
      }
    }

    store.dispatch(setProgress(100));

  });


 
export const getAllBloodRequestByMe = async (showAlert = true) => 
  new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(30));
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/get-all-blood-request-by-me/`
      ); 
      console.log({res})
      resolve(res);
    } catch (error) {

        reject(error)
      if (showAlert) {
        if(error?.response?.data?.success === false) {
            store.dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
            store.dispatch(alert("Failed to  get all blood requests 😕", "danger"));
        }
      }
    }
    

    store.dispatch(setProgress(100));

  });


 
 
export const filterMyBloodRequests = async (params, showAlert = true) => 
  new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(30));
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/filter-my-blood-requests/`, {params: {...params}}
      ); 
      console.log({res})
      resolve(res);
    } catch (error) {

        reject(error)
      if (showAlert) {
        if(error?.response?.data?.success === false) {
            store.dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
            store.dispatch(alert("Failed to filter blood requests 😕", "danger"));
        }
      }
    }
    

    store.dispatch(setProgress(100));

  });
 
 
export const filterMyFavBloodRequests = async (params, showAlert = true) => 
  new Promise(async (resolve, reject) => {
    store.dispatch(setProgress(30));
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/filter-my-favorite-blood-requests/`, {params: {...params}}
      ); 
      console.log({res})
      resolve(res);
    } catch (error) {

        reject(error)
      if (showAlert) {
        if(error?.response?.data?.success === false) {
            store.dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
            store.dispatch(alert("Failed to filter blood requests 😕", "danger"));
        }
      }
    }
    

    store.dispatch(setProgress(100));

  });


 
  
export const getAllDonorRequestByMe = async (params={}, showAlert = true) => 
new Promise(async (resolve, reject) => {
  store.dispatch(setProgress(30));
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}api/blood/donor-request/get-all-donor-request-by-me/`, {params: {...params}}
    ); 
    console.log({res})
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
          store.dispatch(alert("Failed to  get all donor requests 😕", "danger"));
      }
    }
  }
  

  store.dispatch(setProgress(100));

});

 
  
export const deleteBloodRequest = async (id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  store.dispatch(setProgress(30));
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}api/blood/blood-request/${id}/`
    ); 
    console.log({res})
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
          store.dispatch(alert("Failed to  get all donor requests 😕", "danger"));
      }
    }
  }
  

  store.dispatch(setProgress(100));

});

 
  
export const addBloodRequestToFavorites = async (blood_request_id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  store.dispatch(setProgress(30));
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}api/blood/blood-request/favorites/`, {blood_request_id: parseInt(blood_request_id)}
    );  
    if(res.status === 201) {
      store.dispatch(alert("Blood request added to your favorites list", "success"));
    }
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to add this blood request to your favorites list 😕", "danger"));
      }
    }
  }
  

  store.dispatch(setProgress(100));

});
 
  
export const removeBloodRequestFromFavorites = async (blood_request_id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  store.dispatch(setProgress(30));
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}api/blood/blood-request/favorites/`, {data: {blood_request_id: parseInt(blood_request_id)}}
    );  
    if(res.status === 204) {
      store.dispatch(alert("Blood request removed from your favorites list", "success"));
    }
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to remove this donor request to your favorites list 😕", "danger"));
      }
    }
  }
  

  store.dispatch(setProgress(100));

});

 
  
export const addDonorRequestToFavorites = async (donor_request_id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  store.dispatch(setProgress(30));
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}api/blood/donor-request/favorites/`, {donor_request_id: parseInt(donor_request_id)}
    );  
    if(res.status === 201) {
      store.dispatch(alert("Donor request added to your favorites list", "success"));
    }
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
          store.dispatch(alert("Failed to add this donor request to your favorites list 😕", "danger"));
      }
    }
  }
  

  store.dispatch(setProgress(100));

});
 
  
export const removeDonorRequestFromFavorites = async (donor_request_id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  store.dispatch(setProgress(30));
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}api/blood/donor-request/favorites/`, {data: {donor_request_id: parseInt(donor_request_id)}}
    );  
    if(res.status === 204) {
      store.dispatch(alert("Donor request removed from your favorites list", "success"));
    }
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to remove this donor request to your favorites list 😕", "danger"));
      }
    }
  }
  

  store.dispatch(setProgress(100));

});

  
export const addUserToFavorites = async (user_id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  store.dispatch(setProgress(30));
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}api/account/users/favorites/`,  {user_id: parseInt(user_id)}
    );  
    if(res.status === 201) {
      store.dispatch(alert("User added to your favorites list", "success"));
    }
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to add this user  to your favorites list 😕", "danger"));
      }
    }
  }
  

  store.dispatch(setProgress(100));

});
  
export const removeUserFromFavorites = async (user_id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  store.dispatch(setProgress(30));
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}api/account/users/favorites/`, {data: {user_id: parseInt(user_id)}}
    );  
    if(res.status === 204) {
      store.dispatch(alert("User removed from your favorites list", "success"));
    }
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to remove this user from your favorites list 😕", "danger"));
      }
    }
  }
  store.dispatch(setProgress(100));

});

  
export const getMessagesForContact = async (contact_id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}api/message/get-messages-for-contact/`, {params: {contact_id: parseInt(contact_id)}}
    );  
 
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to fetch message for this contact 😕", "danger"));
      }
    }
  }

});
  
export const getMyContacts = async (showAlert = true) => 
new Promise(async (resolve, reject) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}api/message/get-my-contacts/`);

 
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to fetch your contacts 😕", "danger"));
      }
    }
  }

});

export const getContactDetails = async (contact_id, showAlert = true) => 
new Promise(async (resolve, reject) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}api/message/get-contact-details/`, {params: {contact_id: parseInt(contact_id)}}); 
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to fetch your contact details 😕", "danger"));
      }
    }
  }

});

export const getNotifications = async (requestUrl=null, showAlert = true) => 
new Promise(async (resolve, reject) => {
  try {

    const res = await axios.get(requestUrl ? requestUrl : `${process.env.REACT_APP_API_URL}api/account/notifications/`); 
    resolve(res);
  } catch (error) {

      reject(error)
    if (showAlert) {
      if(error?.response?.data?.success === false) {
          store.dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        store.dispatch(alert("Failed to fetch your contact details 😕", "danger"));
      }
    }
  }

});


 