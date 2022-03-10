import React, { useState, useEffect } from "react";
import { Route, Link, useHistory, useLocation } from "react-router-dom";
import "../../assets/css/transitions.css";
import { Autocomplete } from "@react-google-maps/api";
import { Marker } from "react-google-maps";
import { FaBan } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";

import logo from "../../assets/img/logo.png";

import Modal from "../../components/Modal/Modal";
import OffCanvas from "../../components/OffCanvas/OffCanvas";
import {
  ProfileImg,
  ButtonDiv,
  Badge,
  Button,
  Profile,
} from "../../styles/Essentials.styles";

import {
  FormWrap,
  Form,
  InputDiv,
  Input,
  TextArea,
  Label,
  customStyles,
} from "../../styles/Form.styles";
import {
  Detail,
  DetailHeader,
  DetailFieldValue,
  DetailField,
  DetailsDiv,
  AllDetails,
  DetailsMap,
  ActionDiv,
  Action,
  NotAvailableWrap,
} from "../../styles/Details.styles";

import Map from "../../components/Map/Map";

import { NavWrap, NavTab } from "../../styles/Nav.styles";

import {
  HtmlTable,
  Td,
  Th,
  Tr,
  OrderedBySection,
  BottomSection,
  SearchForm,
  SearchInp,
  TopSection,
} from "../../styles/Table.styles";

import { Wrap } from "../styles/dashboard/Request.styles";

import Dropdown from "../../components/Dropdown/Dropdown";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "../../redux/progress/actions";
import alert from "../../redux/alert/actions";
import { calcDistance, getCurrentLocation } from "../../helpers";
import Select from "react-select";
import Moment from "react-moment";
import {
  getBloodRequestData,
  getProfileDetailsForUser,
  getTotalDonorRequestsForBloodRequest,
} from "../../apiCalls";
import Transition from "../../components/Transition/Transition";

export default function Request({ match }) {
  // hooks
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // call the apis and get request data

  // states
  const [requestData, setRequestData] = useState(null);
  const [requestorProfileData, setRequestorProfileData] = useState(null);
  const [totalDonorRequestGot, setTotalDonorRequestGot] = useState(0);

  // functions
  const getRequestData = async () => {
    try {
      const res = await getBloodRequestData(match?.params?.bloodRequestId);
      if (res.status === 200) {
        setRequestData(res.data);
        getProfileDetailsForUser(res.data.user.id).then((res) =>
          setRequestorProfileData(res.data)
        );
        getTotalDonorRequestsForBloodRequest(res.data.id).then((res) =>
          setTotalDonorRequestGot(res?.data?.total)
        );
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        setRequestData("404_NOT_AVAILABLE");
      }
    }
  };

  useEffect(async () => {
    dispatch(setProgress(30));
    await getRequestData();
    dispatch(setProgress(100));
  }, []);

  const checkHaveSentDonorRequest = async (bloodRequestId) => {
    if (bloodRequestId) {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}api/blood/blood-request/${bloodRequestId}/have-sent-donor-request/`
        );
        if (res?.status === 200) {
          if (res?.data?.haveSentDonorRequest) {
            return true;
          }
        }
      } catch (err) {}
    }
    return false;
  };

  return (
    <>
      <NavWrap>
        <NavTab
          activeClassName="active"
          exact
          to={`/requests/${match.params.bloodRequestId}/`}>
          Request
        </NavTab>

        {requestData?.user?.id === auth.user_id ? (
          <NavTab
            activeClassName="active"
            exact
            to={`/requests/${match.params.bloodRequestId}/donors/`}>
            Donor Requests
          </NavTab>
        ) : (
          requestData && (
            <NavTab
              activeClassName="active"
              exact
              to={`/requests/${match.params.bloodRequestId}/donor-request/`}
              disabled={requestData === "404_NOT_AVAILABLE"}>
              Your Donor Request
            </NavTab>
          )
        )}
      </NavWrap>

      <Route exact path="/requests/:bloodRequestId/">
        <RequestDetails
          requestData={requestData}
          requestorProfileData={requestorProfileData}
          setRequestData={setRequestData}
          checkHaveSentDonorRequest={checkHaveSentDonorRequest}
          totalDonorRequestGot={totalDonorRequestGot}
        />
      </Route>

      {requestData?.user?.id === auth.user_id ? (
        <Route exact path="/requests/:bloodRequestId/donors/">
          <DonorRequests
            match={match}
            requestData={requestData}
            setRequestData={setRequestData}
          />
        </Route>
      ) : requestData && requestData !== "404_NOT_AVAILABLE" ? (
        <Route exact path="/requests/:bloodRequestId/donor-request/">
          <YourDonorRequest bloodRequestId={match.params.bloodRequestId} />
        </Route>
      ) : (
        ""
      )}
    </>
  );
}

const RequestDetails = ({
  match,
  requestData,
  requestorProfileData,
  setRequestData,
  totalDonorRequestGot,
  checkHaveSentDonorRequest,
}) => {
  // states

  const report = () => {
    // call api to report this request
    console.log("report request");
  };
  const [dropDownOption, setDropDownOption] = useState([
    { name: "Report", icon: FaBan, onClick: report },
  ]);

  // hooks
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return (
    <>
      {requestData === "404_NOT_AVAILABLE" ? (
        <NotAvailableWrap>
          <h2>404 - This blood request is not available</h2>
        </NotAvailableWrap>
      ) : (
        <>
          <DetailsMap>
            <Map
              coords={requestData?.location}
              isMarkerShown
              googleMapURL=" "
              loadingElement={
                <div style={{ height: `350px`, width: "100%" }} />
              }
              containerElement={
                <div style={{ height: `350px`, width: "100%" }} />
              }
              mapElement={<div style={{ height: `350px`, width: "100%" }} />}
              defaultZoom={14}>
              {<Marker position={requestData?.location} />}
            </Map>
          </DetailsMap>
          <AllDetails>
            <DetailsDiv>
              <DetailHeader>Posted By: </DetailHeader>
              <Profile to={`/profile/${requestData?.user?.id}/`}>
                <ProfileImg
                  size="55px"
                  style={{ marginRight: "10px" }}
                  src={`${process.env.REACT_APP_MEDIA_URL}${requestorProfileData?.profile_img}`}
                />
                <DetailFieldValue className="profile-link-name">
                  {requestData?.name}
                </DetailFieldValue>
              </Profile>
              <DetailHeader>Informations: </DetailHeader>
              <Detail>
                <DetailField>Name: </DetailField>
                <DetailFieldValue>{requestData?.name}</DetailFieldValue>
              </Detail>
              <Detail>
                <DetailField>Time: </DetailField>
                <DetailFieldValue>
                  <Moment format="DD/MM/YYYY hh:MM A">
                    {requestData?.date_time}
                  </Moment>{" "}
                </DetailFieldValue>
              </Detail>
              <Detail>
                <DetailField>Blood Group: </DetailField>
                <DetailFieldValue>{requestData?.blood_group}</DetailFieldValue>
              </Detail>
              <Detail>
                <DetailField>Number: </DetailField>
                <DetailFieldValue>{requestData?.number}</DetailFieldValue>
              </Detail>
              <Detail>
                <DetailField>Additional Number: </DetailField>
                <DetailFieldValue>{requestData?.number}</DetailFieldValue>
              </Detail>
              <Detail>
                <DetailField>Email: </DetailField>
                <DetailFieldValue>{requestData?.email}</DetailFieldValue>
              </Detail>

              <DetailHeader>Description: </DetailHeader>
              <Detail>
                <DetailFieldValue>{requestData?.description}</DetailFieldValue>
              </Detail>
              <ButtonDiv>
                {auth?.user_id === requestData?.user.id ? (
                  <>
                    <UpdateRequest
                      setRequestData={setRequestData}
                      requestData={requestData}
                    />
                    <Complete
                      requestData={requestData}
                      setRequestData={setRequestData}
                    />
                  </>
                ) : auth?.user_id !== requestData?.user?.id ? (
                  <SendDonorRequestForm
                    checkHaveSentDonorRequest={checkHaveSentDonorRequest}
                    bloodRequestId={requestData?.id}
                  />
                ) : (
                  ""
                )}
              </ButtonDiv>
            </DetailsDiv>
            <ActionDiv>
              <Action>
                <Dropdown options={dropDownOption} />
              </Action>
              <Action>
                <div className="action-badge">
                  <Badge
                    info
                    style={{
                      width: "max-content",
                    }}>
                    {requestData?.status}
                  </Badge>
                  <Badge
                    info
                    style={{
                      width: "max-content",
                    }}>
                    {totalDonorRequestGot} Request Got
                  </Badge>
                </div>
              </Action>
            </ActionDiv>
          </AllDetails>
        </>
      )}
    </>
  );
};

const SendDonorRequestForm = ({
  bloodRequestId,
  checkHaveSentDonorRequest,
}) => {
  const [autoComplete, setAutoComplete] = useState(null);
  const [coords, setCoords] = useState({});
  const [mark, setMark] = useState(false);

  const [showDonorReqModal, setShowDonorReqModal] = useState(false);
  const [donorRequestFormData, setDonorRequestFormData] = useState({
    name: "",
    email: "",
    date_time: "",
    number: "",
    add_number: "",
    address: "",
    description: "",
    location: {},
  });

  const [haveSentDonorRequest, setHaveSentDonorRequest] = useState(false);

  // hooks
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  function setCurrentLocation() {
    getCurrentLocation((crds) => {
      setDonorRequestFormData({ ...donorRequestFormData, location: crds });
      setCoords(crds);
    });
  }

  useEffect(() => {
    setCurrentLocation();
  }, []);

  useEffect(() => {
    setDonorRequestFormData(profile);
  }, [profile]);

  const onPlaceChanged = () => {
    try {
      const lat = autoComplete.getPlace().geometry.location.lat();
      const lng = autoComplete.getPlace().geometry.location.lng();
      setCoords({ lat, lng });
      setDonorRequestFormData({
        ...donorRequestFormData,
        location: { lat, lng },
      });
    } catch {}
  };

  // check if user have already sent a request

  useEffect(async () => {
    setHaveSentDonorRequest(await checkHaveSentDonorRequest(bloodRequestId));
  }, [bloodRequestId]);

  const onChange = (e) =>
    setDonorRequestFormData({
      ...donorRequestFormData,
      [e.target.name]: e.target.value,
    });

  // on form submit send donor request to api
  const {
    name,
    email,
    date_time,
    address,
    number,
    add_number,
    location,
    description,
  } = donorRequestFormData;
  const sendDonorRequest = async (e) => {
    e.preventDefault();
    dispatch(setProgress(20));
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/`,
        {
          ...donorRequestFormData,
          blood_request: bloodRequestId,
        }
      );

      if (res.status === 201) {
        dispatch(setProgress(90));
        dispatch(
          alert("Your donor request was sent successfully 🙂", "success")
        );
        setHaveSentDonorRequest(true);
        setShowDonorReqModal(false);
      }
    } catch (err) {
      if (
        err?.response?.status === 400 &&
        err?.response?.data?.success === false
      ) {
        dispatch(alert(err?.response?.data?.error, "danger"));
      } else {
        dispatch(alert("Failed to send your donor request 😐", "danger"));
      }

      // console.log(err);
    }
    dispatch(setProgress(100));
  };

  return (
    <>
      <Button
        disabled={!profile.isCompleted || haveSentDonorRequest}
        onClick={(e) => {
          setShowDonorReqModal(true);
        }}
        info>
        {haveSentDonorRequest ? "Donor Request Sent" : "Send Donor Request"}
      </Button>
      {profile.isCompleted || !haveSentDonorRequest ? (
        // <form onSubmit={sendDonorRequest}>
        <Modal
          actionText="Send Donor Request"
          title="Help Request Form"
          lg
          top
          info
          btnText="Help"
          fade
          scale
          buttonInfo
          show={showDonorReqModal}
          setShow={setShowDonorReqModal}
          formId="donor-request-form">
          <FormWrap>
            <Form onSubmit={sendDonorRequest} id="donor-request-form">
              <InputDiv size={4}>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  type="text"
                  name="name"
                  value={name}
                  required
                  onChange={onChange}
                />
              </InputDiv>
              <InputDiv size={5}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={email}
                  required
                  onChange={onChange}
                />
              </InputDiv>
              <InputDiv size={3}>
                <Label htmlFor="time">When Can You come to donate Blood</Label>
                <Input
                  id="time"
                  placeholder="Time"
                  type="datetime-local"
                  name="date_time"
                  value={date_time}
                  onChange={onChange}
                  required
                />
              </InputDiv>
              <InputDiv size={4}>
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  placeholder="Phone Number"
                  type="tel"
                  name="number"
                  value={number}
                  required
                  onChange={onChange}
                />
              </InputDiv>
              <InputDiv size={4}>
                <Label htmlFor="add-number">Additional Phone Number</Label>
                <Input
                  id="add-number"
                  placeholder="Additional Phone Number"
                  type="tel"
                  value={add_number}
                  onChange={onChange}
                  required
                  name="add_number"
                />
              </InputDiv>
              <InputDiv size={4}>
                <Label htmlFor="address">Address (Where do you live)</Label>
                <Input
                  id="address"
                  placeholder="Address (Where do you live)"
                  type="text"
                  name="address"
                  onChange={onChange}
                  required
                  value={address}
                />
              </InputDiv>

              <InputDiv>
                <Label htmlFor="add-number">Short Description</Label>

                <TextArea
                  required
                  placeholder="Short Description"
                  onChange={onChange}
                  name="description"
                  value={description}>
                  {description}
                </TextArea>
              </InputDiv>

              <InputDiv
                flex
                style={{ justifyContent: "space-between" }}
                size={12}>
                <Button
                  type="button"
                  info
                  blockOnSmall
                  style={{ position: "relative", top: "14px" }}
                  onClick={(e) => {
                    setCurrentLocation();
                  }}>
                  Get Current Location
                </Button>

                <Autocomplete
                  onLoad={(autoC) => setAutoComplete(autoC)}
                  onPlaceChanged={onPlaceChanged}>
                  <>
                    <Label htmlFor="add-number">
                      Current Location of Donor *
                    </Label>
                    <Input
                      id="places"
                      placeholder="Search Places..."
                      type="text"
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          e.preventDefault();
                        } else {
                          return true;
                        }
                      }}
                    />
                  </>
                </Autocomplete>
              </InputDiv>

              <InputDiv
                style={{
                  boxShadow: "0px 0px 15px 2px var(--main-box-shadow-color)",
                }}
                height="400px"
                size={12}>
                <Map
                  coords={coords}
                  isMarkerShown
                  googleMapURL=" "
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `100%` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  setCoords={setCoords}
                  click={(e) =>
                    setDonorRequestFormData({
                      ...donorRequestFormData,
                      location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                    })
                  }
                  defaultZoom={17}>
                  {location ? <Marker position={location} /> : ""}
                </Map>
              </InputDiv>
            </Form>
          </FormWrap>
        </Modal>
      ) : (
        // </form>
        ""
      )}
    </>
  );
};

const Complete = ({ requestData, setRequestData }) => {
  // states
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [completeReqFormData, setCompleteReqFormData] = useState({
    rating: 3,
    description: "",
  });

  const { rating, description } = completeReqFormData;

  // hooks
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const sendRequest = (e) => {
    e.preventDefault();
  };
  const secondExample = {
    size: 35,
    count: 5,
    activeColor: "var(--primary-color)",
    value: rating,
    a11y: true,
    isHalf: true,
    emptyIcon: <BsStar />,
    halfIcon: <BsStarHalf />,
    filledIcon: <BsStarFill />,
    onChange: (newValue) =>
      setCompleteReqFormData({ ...completeReqFormData, rating: newValue }),
  };

  // functions

  const onInputValChange = (e) =>
    setCompleteReqFormData({
      ...completeReqFormData,
      [e.target.name]: e.target.value,
    });

  const completeBloodRequest = async (e) => {
    e.preventDefault();
    dispatch(setProgress(30));
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/${requestData?.id}/complete-blood-request/`,
        completeReqFormData
      );
      console.log(res);
      if (res.status === 200 && res.data.success) {
        setRequestData({ ...requestData, status: "Completed" });
        dispatch(alert(res?.data?.message));
        setShowCompleteModal(false);
      }
    } catch (err) {
      console.log(err);
      if (err.response.data.success === false) {
        dispatch(alert(err.response.data.error, "danger"));
      }
    }
    dispatch(setProgress(100));
  };

  return (
    <>
      <Button
        disabled={!profile.isCompleted || requestData.status !== "Accepted"}
        onClick={(e) => setShowCompleteModal(true)}>
        Complete
      </Button>
      {profile.isCompleted && requestData.status === "Accepted" && (
        <Modal
          actionText="Complete"
          title="Review And Complete Request"
          md
          info
          btnText="Complete"
          fade
          scale
          setShow={setShowCompleteModal}
          show={showCompleteModal}
          formId="complete-form">
          <FormWrap>
            <Form onSubmit={completeBloodRequest} id="complete-form">
              <InputDiv>
                <Label htmlFor="add-number">
                  Express your experience with this Donor
                </Label>
                <TextArea
                  required
                  onChange={onInputValChange}
                  name="description"
                  value={description}
                  placeholder="Short Description">
                  {description}
                </TextArea>
              </InputDiv>
              <InputDiv>
                <Label htmlFor="add-number">
                  Express your experience with this Donor
                </Label>
                <ReactStars style={{ marginTop: "11px" }} {...secondExample} />
              </InputDiv>
            </Form>
          </FormWrap>
        </Modal>
      )}
    </>
  );
};

const UpdateRequest = ({ requestData, setRequestData }) => {
  const bloodGroups = [
    { value: "Select", label: "Select" },
    { value: "A+", label: "A+" },
    { value: "B+", label: "B+" },
    { value: "AB+", label: "AB+" },
    { value: "O+", label: "O+" },
    { value: "A-", label: "A-" },
    { value: "B-", label: "B-" },
    { value: "AB-", label: "AB-" },
    { value: "O-", label: "O-" },
  ];
  // states
  const [autoComplete, setAutoComplete] = useState(null);
  const [mark, setMark] = useState(false);

  const [showUpdateRequestModal, setShowUpdateRequestModal] = useState(false);

  // hooks
  const auth = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const history = useHistory();

  function setCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        setMark({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      },
      () => console.log("error :)"),
      { timeout: 10000 }
    );
  }
  useEffect(() => {
    setCurrentLocation();
  }, []);

  const onPlaceChanged = () => {
    try {
      const lat = autoComplete.getPlace().geometry.location.lat();
      const lng = autoComplete.getPlace().geometry.location.lng();
      setMark({ lat, lng });
    } catch {}
  };

  // form data submit
  const defaultRequestFormData = requestData;
  const [updateRequestFormData, setUpdateRequestFormData] = useState(
    defaultRequestFormData
  );
  useEffect(() => {
    setUpdateRequestFormData({ ...updateRequestFormData, location: mark });
  }, [mark]);

  const {
    name,
    email,
    date_time,
    number,
    add_number,
    blood_group,
    timestamp,
    description,
  } = updateRequestFormData;

  const onChange = (e) =>
    setUpdateRequestFormData({
      ...updateRequestFormData,
      [e.target.name]: e.target.value,
    });

  const submitUpdateRequest = async (e) => {
    e.preventDefault();
    dispatch(setProgress(10));
    try {
      dispatch(setProgress(20));

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/${requestData?.id}/`,
        updateRequestFormData
      );
      dispatch(setProgress(70));
      if (res?.status === 200) {
        dispatch(
          alert("Your Blood Request Was Updated Successfully", "success")
        );
        setUpdateRequestFormData(res.data);
        setRequestData(res.data);
        setShowUpdateRequestModal(false);
        dispatch(setProgress(90));
      }
    } catch (err) {
      dispatch(alert("Failed to update your blood request", "danger"));
    }
    dispatch(setProgress(100));
  };

  return (
    <>
      <Button
        disabled={!profile.isCompleted || requestData?.status !== "Open"}
        onClick={(e) => setShowUpdateRequestModal(true)}
        info>
        Update
      </Button>
      {requestData?.status === "Open" && (
        <Modal
          actionText="Update Blood Request"
          title="Update Your Blood Request"
          lg
          info
          btnText="Update"
          fade
          scale
          setShow={setShowUpdateRequestModal}
          show={showUpdateRequestModal}
          wrapStyle={{ alignItems: "start" }}
          closeOnOutsideClick={false}
          formId="update-request-form">
          <FormWrap>
            <Form id="update-request-form" onSubmit={submitUpdateRequest}>
              <InputDiv size={4}>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  type="text"
                  name="name"
                  onChange={onChange}
                  value={name}
                  disabled={!profile.isCompleted}
                />
              </InputDiv>
              <InputDiv size={5}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={onChange}
                  value={email}
                  disabled={!profile.isCompleted}
                />
              </InputDiv>
              <InputDiv size={3}>
                <Label htmlFor="time">When Do You Need Blood</Label>
                <Input
                  id="time"
                  placeholder="Time"
                  type="datetime-local"
                  name="date_time"
                  onChange={onChange}
                  value={new Date(date_time).toISOString().substr(0, 16)}
                  disabled={!profile.isCompleted}
                />
              </InputDiv>
              <InputDiv size={3}>
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  placeholder="Phone Number"
                  type="tel"
                  name="number"
                  onChange={onChange}
                  value={number}
                  disabled={!profile.isCompleted}
                />
              </InputDiv>
              <InputDiv size={3}>
                <Label htmlFor="add-number">Additional Phone Number</Label>
                <Input
                  id="add-number"
                  placeholder="Additional Phone Number"
                  type="tel"
                  name="add_number"
                  onChange={onChange}
                  value={add_number}
                  disabled={!profile.isCompleted}
                />
              </InputDiv>
              <InputDiv size={6}>
                <Label>Blood Group</Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={bloodGroups.find(
                    (group) => group.value === requestData?.blood_group
                  )}
                  disabledValue={bloodGroups[0]}
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="blood-group"
                  options={bloodGroups}
                  styles={customStyles}
                  onChange={(e) =>
                    setUpdateRequestFormData({
                      ...updateRequestFormData,
                      blood_group: e.value,
                    })
                  }
                  disabled={!profile.isCompleted}
                />
              </InputDiv>

              <InputDiv>
                <Label>Description</Label>

                <TextArea
                  disabled={!profile.isCompleted}
                  onChange={onChange}
                  name="description"
                  value={description}
                  height="200px"
                  placeholder="Description"></TextArea>
              </InputDiv>

              <InputDiv
                flex
                style={{ justifyContent: "space-between" }}
                size={12}>
                <Button
                  type="button"
                  info
                  blockOnSmall
                  style={{ position: "relative", top: "14px" }}
                  onClick={(e) => {
                    setCurrentLocation();
                  }}>
                  Current Location
                </Button>

                <Autocomplete
                  onLoad={(autoC) => setAutoComplete(autoC)}
                  onPlaceChanged={onPlaceChanged}>
                  <>
                    <Label htmlFor="add-number">
                      Where do you need blood? *
                    </Label>
                    <Input
                      id="places"
                      placeholder="Search Places..."
                      type="text"
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          e.preventDefault();
                        } else {
                          return true;
                        }
                      }}
                    />
                  </>
                </Autocomplete>
              </InputDiv>

              <InputDiv
                style={{
                  boxShadow: "0px 0px 15px 2px var(--main-box-shadow-color)",
                }}
                height="400px"
                size={12}>
                <Map
                  coords={mark}
                  isMarkerShown
                  googleMapURL=" "
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `100%` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  setMark={setMark}
                  click={(e) =>
                    setMark({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                  }
                  defaultZoom={17}>
                  {mark ? <Marker position={mark} /> : ""}
                </Map>
              </InputDiv>
            </Form>
          </FormWrap>
        </Modal>
      )}
    </>
  );
};

const DonorRequests = ({ match, requestData, setRequestData }) => {
  // hooks
  const location = useLocation();
  const dispatch = useDispatch();

  const [donorRequestData, setDonorRequestData] = useState([]);
  const [showDonorRequest, setShowDonorRequest] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [donorRequestMoreDetails, setDonorRequestMoreDetails] = useState(null);

  const [showEmail, setShowEmail] = useState(true);

  window.addEventListener("resize", (e) => {
    if (window.innerWidth <= 550) {
      setShowEmail(false);
    } else {
      setShowEmail(true);
    }
  });

  const getDonorRequestsForBloodRequest = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/get-donor-requests-for-my-blood-request/`,
        { params: { blood_request_id: match?.params?.bloodRequestId } }
      );
      console.log(res);
      if (res.status === 200) {
        setDonorRequestData(res.data);
        getCurrentLocation((crds) => {
          setCurrentLocation(crds);
        });
      }
    } catch (error) {
      dispatch(alert("Failed to fetch donor requests", "danger"));
    }
  };

  useEffect(async () => {
    dispatch(setProgress(30));
    await getDonorRequestsForBloodRequest();
    dispatch(setProgress(100));
  }, [requestData]);

  const showMoreDetails = (id) => {
    setShowDonorRequest(true);
    donorRequestData.map(
      (donorRequest) =>
        donorRequest.id === id && setDonorRequestMoreDetails(donorRequest)
    );
  };
  const onCanvasExit = () => {
    setTimeout(() => {
      setDonorRequestMoreDetails(null);
      setShowDonorRequest(false);
    }, 450);
  };

  return (
    <>
      <Wrap>
        <TopSection>
          <SearchForm>
            <SearchInp placeholder="Search..." />
          </SearchForm>
          <OrderedBySection>
            {/* <Select>
                            <Option>Request Time</Option>
                            <Option>A - Z</Option>
                            <Option>Z - A</Option>
                        </Select> */}
          </OrderedBySection>
        </TopSection>
        <BottomSection>
          <HtmlTable>
            <Tr style={{ cursor: "default" }}>
              <Th>$</Th>
              <Th>Profile</Th>
              <Th>Time</Th>
              <Th>Distance</Th>
              <Th>Number</Th>
              {showEmail ? <Th>Email</Th> : ""}
            </Tr>
            {donorRequestData.map((donorRequest, index) => (
              <Tr key={index} onClick={(e) => showMoreDetails(donorRequest.id)}>
                <Td>{index + 1}</Td>
                <Td>
                  {" "}
                  <Link
                    style={{ display: "flex", alignItems: "center" }}
                    to={`/profile/${donorRequest?.user?.id}/`}>
                    <ProfileImg
                      size="45px"
                      src={`${process.env.REACT_APP_MEDIA_URL}${donorRequest?.profile.profile_img}`}
                    />{" "}
                    <p
                      className="profile-link-name"
                      style={{
                        position: "relative",
                        left: "15px",
                        fontWeight: "600",
                      }}>
                      {donorRequest?.profile?.name}
                    </p>
                  </Link>
                </Td>
                <Td>
                  <Moment format="DD/MM/YYYY hh:MM A">
                    {donorRequest?.date_time}
                  </Moment>
                </Td>
                <Td>
                  {calcDistance(donorRequest?.location, currentLocation)} KM
                </Td>
                <Td>{donorRequest?.number}</Td>
                {showEmail ? <Td>{donorRequest?.email}</Td> : ""}
                <div className="table-row-badge">
                  {donorRequest?.status === "Accepted" ? (
                    <Badge sm> ACCEPTED </Badge>
                  ) : donorRequest?.status === "Reviewed" ? (
                    <Badge sm> REVIEWED </Badge>
                  ) : (
                    ""
                  )}

                  <Badge sm>
                    <Moment fromNow>{donorRequest.timestamp}</Moment>
                  </Badge>
                </div>
              </Tr>
            ))}
          </HtmlTable>
        </BottomSection>

        <OffCanvas
          onCanvasExit={onCanvasExit}
          setShow={setShowDonorRequest}
          show={showDonorRequest}>
          {donorRequestMoreDetails && showDonorRequest ? (
            <DonorRequestMoreDetails
              donorRequestMoreDetails={donorRequestMoreDetails}
              requestData={requestData}
              setRequestData={setRequestData}
              setShowDonorRequest={setShowDonorRequest}
            />
          ) : (
            ""
          )}
        </OffCanvas>
      </Wrap>
    </>
  );
};

const DonorRequestMoreDetails = ({
  donorRequestMoreDetails,
  requestData,
  setRequestData,
  setShowDonorRequest,
}) => {
  // hooks

  const dispatch = useDispatch();

  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  const report = () => {
    // call api to report this request
    console.log("report request");
  };

  const dropDownOptions = [{ name: "Report", icon: FaBan, onClick: report }];

  useEffect(() => {
    getCurrentLocation((crds) => {
      setCurrentLocation(crds);
    });
  }, []);

  const acceptDonorRequest = async (id) => {
    if (requestData.status === "Open") {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}api/blood/donor-request/accept-donor-request/`,
          { donor_request_id: id }
        );
        console.log(res);
        if (res.status === 200) {
          setRequestData({ ...requestData, status: "Accepted" });
          dispatch(alert("Donor request accepted", "success"));
          setShowDonorRequest(false);
        }
      } catch (error) {
        if (error?.response?.data?.success === false) {
          dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
          dispatch(alert("Failed to accept this donor request 😐", "danger"));
        }
      }
    } else {
      dispatch(alert("You can't accept this request", "danger"));
    }
  };

  const rejectDonorRequest = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/reject-donor-request/`,
        { donor_request_id: id }
      );
      console.log(res);
      if (res.status === 200) {
        setRequestData({ ...requestData, status: "Open" });
        dispatch(alert("Donor request rejected", "success"));
        setShowDonorRequest(false);
      }
    } catch (error) {
      if (error?.response?.data?.success === false) {
        dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        dispatch(alert("Failed to reject this donor request 😐", "danger"));
      }
      console.log(error);
    }
  };

  const cancelAcceptedDonorRequest = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/cancel-accepted-donor-request/`,
        { donor_request_id: id }
      );
      console.log(res);
      if (res.status === 200) {
        setRequestData({ ...requestData, status: "Open" });
        dispatch(
          alert("Accepted donor request was canceled successfully", "success")
        );
        setShowDonorRequest(false);
      }
    } catch (error) {
      if (error?.response?.data?.success === false) {
        dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        dispatch(
          alert("Failed to cancel this accepted donor request 😐", "danger")
        );
      }
    }
  };

  return (
    <AllDetails>
      <DetailsDiv>
        <DetailHeader>Requested By: </DetailHeader>
        <Detail>
          <Dropdown
            style={{ position: "absolute", right: "38px" }}
            options={dropDownOptions}
          />
        </Detail>
        <Detail>
          <Link
            style={{ display: "flex", alignItems: "center" }}
            to={`/profile/${donorRequestMoreDetails?.user?.id}/`}>
            <ProfileImg
              size="45px"
              src={`${process.env.REACT_APP_MEDIA_URL}${donorRequestMoreDetails?.profile?.profile_img}`}
            />{" "}
            <p
              className="profile-link-name"
              style={{
                position: "relative",
                left: "15px",
                fontWeight: "600",
              }}>
              {donorRequestMoreDetails?.profile?.name}
            </p>{" "}
          </Link>
        </Detail>

        <DetailHeader>Informations: </DetailHeader>
        <Detail>
          <DetailField>Name: </DetailField>
          <DetailFieldValue>{donorRequestMoreDetails?.name}</DetailFieldValue>
        </Detail>
        <Detail>
          <DetailField>Time: </DetailField>
          <DetailFieldValue>
            <Moment format="DD/MM/YYYY hh:MM A">
              {donorRequestMoreDetails?.date_time}
            </Moment>
          </DetailFieldValue>
        </Detail>
        <Detail>
          <DetailField>Distance: </DetailField>
          <DetailFieldValue>
            {calcDistance(donorRequestMoreDetails?.location, currentLocation)}{" "}
            KM
          </DetailFieldValue>
        </Detail>

        <DetailHeader>Contacts: </DetailHeader>
        <Detail>
          <DetailField>Email: </DetailField>
          <DetailFieldValue>{donorRequestMoreDetails?.email}</DetailFieldValue>
        </Detail>
        <Detail>
          <DetailField>Number: </DetailField>
          <DetailFieldValue>{donorRequestMoreDetails?.number}</DetailFieldValue>
        </Detail>
        <Detail>
          <DetailField>Additional Number: </DetailField>
          <DetailFieldValue>
            {donorRequestMoreDetails?.add_number}
          </DetailFieldValue>
        </Detail>

        <DetailHeader>Description: </DetailHeader>
        <Detail>
          <DetailFieldValue>
            {donorRequestMoreDetails?.description}
          </DetailFieldValue>
        </Detail>
        <DetailHeader>Actions: </DetailHeader>
        <ButtonDiv>
          <Button
            onClick={(e) =>
              window.confirm(
                "Are you sure you want to accept this donor request? (You can accept only one donor request)"
              ) && acceptDonorRequest(donorRequestMoreDetails?.id)
            }
            sm
            disabled={requestData.status === "Open" ? false : true}
            info>
            {donorRequestMoreDetails.status === "Accepted"
              ? "Accepted"
              : "Accept"}
          </Button>

          {donorRequestMoreDetails.status === "Accepted" || donorRequestMoreDetails?.status === "Reviewed" ? (
            <Button
              onClick={(e) =>
                window.confirm(
                  "Are you sure you want to cancel the acceptance of this this donor request?"
                ) && cancelAcceptedDonorRequest(donorRequestMoreDetails.id)
              }
              disabled={donorRequestMoreDetails.status !== "Accepted"}
              sm>
              Cancel
            </Button>
          ) : (
            <Button
              onClick={(e) =>
                window.confirm(
                  "Are you sure you want to reject this donor request?"
                ) && rejectDonorRequest(donorRequestMoreDetails.id)
              }
              disabled={donorRequestMoreDetails.status !== "Pending" || (requestData.status !== 'Open' &&  requestData.status !== 'Accepted')  }
              sm>
              Reject
            </Button>
          )}
        </ButtonDiv>
      </DetailsDiv>
    </AllDetails>
  );
};

const YourDonorRequest = ({ bloodRequestId }) => {
  // hooks
  const dispatch = useDispatch();
  const history = useHistory();

  const [myDonorRequestData, setMyDonorRequestData] = useState(null);
  const [autoComplete, setAutoComplete] = useState(null);
  const [coords, setCoords] = useState({ lat: 24.0077202, lng: 89.2429551 });
  const [mark, setMark] = useState(false);
  function setCurrentLocation() {
    getCurrentLocation((coords) => {
      setCoords(coords);
      setMark(coords);
    });
  }
  useEffect(async () => {
    setCurrentLocation();

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/get-my-donor-request-for-blood-request/`,
        {
          params: { bloodRequestId: bloodRequestId },
        }
      );
      if (res.status === 200) {
        setMyDonorRequestData(res.data);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 404) {
        setMyDonorRequestData("404_NOT_FOUND");
      }
    }
  }, []);

  const onPlaceChanged = () => {
    try {
      const lat = autoComplete.getPlace().geometry.location.lat();
      const lng = autoComplete.getPlace().geometry.location.lng();
      setMark({ lat, lng });
      setCoords({ lat, lng });
    } catch {}
  };

  // drop down options

  const deleteDonorRequest = async () => {
    dispatch(setProgress(20));
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/${myDonorRequestData?.id}/`
      );
      console.log(res);
      if (res.status === 204) {
        dispatch(alert("Your donor request has been deleted successfully"));
        history.push("/requests/" + myDonorRequestData?.blood_request + "/");
        dispatch(setProgress(80));
        setMyDonorRequestData(null);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 404) {
        dispatch(alert("this donor request is not available", "danger"));
      } else if (error?.response?.data?.success === false) {
        dispatch(alert(error?.response?.data?.error, "danger"));
      } else {
        dispatch(alert("something went wrong", "danger"));
      }
    }
    dispatch(setProgress(100));
  };

  const dropDownOption = [
    {
      name: "Delete",
      icon: <FaBan />,
      onClick: deleteDonorRequest,
      hidden: myDonorRequestData?.status !== "Pending",
    },
  ];

  return (
    <>
      {myDonorRequestData === "404_NOT_FOUND" ? (
        <NotAvailableWrap>
          <h2>you haven't sent any donor request!</h2>
        </NotAvailableWrap>
      ) : (
        myDonorRequestData && (
          <>
            <DetailsMap>
              <Map
                coords={myDonorRequestData?.location}
                isMarkerShown
                googleMapURL=" "
                loadingElement={
                  <div style={{ height: `350px`, width: "100%" }} />
                }
                containerElement={
                  <div style={{ height: `350px`, width: "100%" }} />
                }
                mapElement={<div style={{ height: `350px`, width: "100%" }} />}
                defaultZoom={14}>
                {<Marker position={myDonorRequestData?.location} />}
              </Map>
            </DetailsMap>
            <AllDetails>
              <DetailsDiv>
                <DetailHeader>Informations: </DetailHeader>
                <Detail>
                  <DetailField>Name: </DetailField>
                  <DetailFieldValue>
                    {myDonorRequestData?.name}
                  </DetailFieldValue>
                </Detail>
                <Detail>
                  <DetailField>Time: </DetailField>
                  <DetailFieldValue>
                    <Moment format="DD/MM/YYYY hh:MM A">
                      {myDonorRequestData?.date_time}
                    </Moment>{" "}
                  </DetailFieldValue>
                </Detail>

                <Detail>
                  <DetailField>Number: </DetailField>
                  <DetailFieldValue>
                    {myDonorRequestData?.number}
                  </DetailFieldValue>
                </Detail>
                <Detail>
                  <DetailField>Additional Number: </DetailField>
                  <DetailFieldValue>
                    {myDonorRequestData?.number}
                  </DetailFieldValue>
                </Detail>
                <Detail>
                  <DetailField>Email: </DetailField>
                  <DetailFieldValue>
                    {myDonorRequestData?.email}
                  </DetailFieldValue>
                </Detail>

                <DetailHeader>Description: </DetailHeader>
                <Detail>
                  <DetailFieldValue>
                    {myDonorRequestData?.description}
                  </DetailFieldValue>
                </Detail>
                <ButtonDiv>
                  <UpdateDonorRequest
                    myDonorRequestData={myDonorRequestData}
                    setMyDonorRequestData={setMyDonorRequestData}
                  />
                </ButtonDiv>
              </DetailsDiv>
              <ActionDiv>
                <Action>
                  <Dropdown options={dropDownOption} />
                </Action>
                <Action>
                  <Badge
                    danger={myDonorRequestData?.status === "Rejected"}
                    style={{
                      position: "absolute",
                      width: "max-content",
                      right: "6px",
                      top: "20px",
                    }}>
                    {myDonorRequestData?.status}
                  </Badge>
                </Action>
              </ActionDiv>
            </AllDetails>
          </>
        )
      )}
    </>
  );
};

const UpdateDonorRequest = ({ myDonorRequestData, setMyDonorRequestData }) => {
  const [showUpdateDonorRequestModal, setShowUpdateDonorRequestModal] =
    useState(false);
  const [autoComplete, setAutoComplete] = useState(null);

  const [donorRequestFormData, setDonorRequestFormData] =
    useState(myDonorRequestData);

  const {
    name,
    email,
    date_time,
    address,
    number,
    add_number,
    location,
    description,
  } = donorRequestFormData;
  const [coords, setCoords] = useState(location);

  // hooks
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  function setCurrentLocation() {
    getCurrentLocation((crds) => {
      setDonorRequestFormData({ ...donorRequestFormData, location: crds });
      setCoords(crds);
    });
  }
  const onPlaceChanged = () => {
    try {
      const lat = autoComplete.getPlace().geometry.location.lat();
      const lng = autoComplete.getPlace().geometry.location.lng();
      setDonorRequestFormData({
        ...donorRequestFormData,
        location: { lat, lng },
      });
      setCoords({ lat, lng });
    } catch {}
  };

  const onChange = (e) =>
    setDonorRequestFormData({
      ...donorRequestFormData,
      [e.target.name]: e.target.value,
    });

  useEffect(() => {}, []);

  const upDateRequest = async (e) => {
    e.preventDefault();
    dispatch(setProgress(20));
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/${donorRequestFormData.id}/`,
        donorRequestFormData
      );

      if (res?.status === 200) {
        dispatch(setProgress(90));
        setMyDonorRequestData(res.data);
        dispatch(
          alert("Your donor request was updates successfully 🙂", "success")
        );
        setShowUpdateDonorRequestModal(false);
      }
    } catch (err) {
      if (
        err?.response?.status === 400 &&
        err?.response?.data?.success === false
      ) {
        dispatch(alert(err?.response?.data?.error, "danger"));
      } else {
        dispatch(alert("Failed to update your donor request 😐", "danger"));
      }

      // console.log(err);
    }
    dispatch(setProgress(100));
  };

  return (
    <>
      <Button
        disabled={myDonorRequestData?.status !== "Pending"}
        onClick={() =>
          myDonorRequestData?.status === "Pending" &&
          setShowUpdateDonorRequestModal(true)
        }>
        Update
      </Button>
      {myDonorRequestData?.status === "Pending" && (
        <form onSubmit={upDateRequest}>
          <Modal
            actionText="Update"
            title="Update Request Form"
            lg
            info
            btnText="Update"
            show={showUpdateDonorRequestModal}
            wrapStyle={{ alignItems: "baseline" }}
            setShow={setShowUpdateDonorRequestModal}>
            <FormWrap>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                }}>
                <InputDiv size={4}>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    type="text"
                    name="name"
                    onChange={onChange}
                    value={name}
                  />
                </InputDiv>
                <InputDiv size={5}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    name="email"
                    onChange={onChange}
                    value={email}
                  />
                </InputDiv>
                <InputDiv size={3}>
                  <Label htmlFor="time">When Do You Need Blood</Label>
                  <Input
                    id="time"
                    placeholder="Time"
                    type="datetime-local"
                    name="date_time"
                    onChange={onChange}
                    value={new Date(date_time).toISOString().substr(0, 16)}
                  />
                </InputDiv>
                <InputDiv size={4}>
                  <Label htmlFor="number">Phone Number</Label>
                  <Input
                    id="number"
                    placeholder="Phone Number"
                    type="tel"
                    name="number"
                    onChange={onChange}
                    value={number}
                  />
                </InputDiv>
                <InputDiv size={4}>
                  <Label htmlFor="add-number">Additional Phone Number</Label>
                  <Input
                    id="add-number"
                    placeholder="Additional Phone Number"
                    type="tel"
                    name="add_number"
                    onChange={onChange}
                    value={add_number}
                  />
                </InputDiv>
                <InputDiv size={4}>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Address"
                    type="text"
                    name="address"
                    onChange={onChange}
                    value={address}
                  />
                </InputDiv>

                <InputDiv>
                  <Label htmlFor="add-number">Short Description</Label>
                  <TextArea
                    placeholder="Short Description"
                    name="description"
                    onChange={onChange}
                    value={description}>
                    {description}
                  </TextArea>
                </InputDiv>

                <InputDiv
                  flex
                  style={{ justifyContent: "space-between" }}
                  size={12}>
                  <Button
                    type="button"
                    info
                    blockOnSmall
                    style={{ position: "relative", top: "14px" }}
                    onClick={(e) => {
                      setCurrentLocation();
                    }}>
                    Get Current Location
                  </Button>

                  <Autocomplete
                    onLoad={(autoC) => setAutoComplete(autoC)}
                    onPlaceChanged={onPlaceChanged}>
                    <>
                      <Label htmlFor="add-number">
                        Current Location of Donor *
                      </Label>
                      <Input
                        id="places"
                        placeholder="Search Places..."
                        type="text"
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            e.preventDefault();
                          } else {
                            return true;
                          }
                        }}
                      />
                    </>
                  </Autocomplete>
                </InputDiv>

                <InputDiv
                  style={{
                    boxShadow: "0px 0px 15px 2px var(--main-box-shadow-color)",
                  }}
                  height="400px"
                  size={12}>
                  <Map
                    coords={coords}
                    isMarkerShown
                    googleMapURL=" "
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    setCoords={setCoords}
                    click={(e) =>
                      setDonorRequestFormData({
                        ...donorRequestFormData,
                        location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                      })
                    }
                    defaultZoom={17}>
                    {location ? <Marker position={location} /> : ""}
                  </Map>
                </InputDiv>
              </Form>
            </FormWrap>
          </Modal>
        </form>
      )}
    </>
  );
};
