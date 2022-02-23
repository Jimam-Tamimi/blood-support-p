import React, { useState, useEffect } from "react";
import { Route, Link, useHistory } from "react-router-dom";
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
import { getCurrentLocation, getProfileData } from "../../helpers";
import Select from "react-select";

export default function Request({ match }) {
  // hooks
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // call the apis and get request data

  // states
  const [requestData, setRequestData] = useState(null);
  const [requestorProfileData, setRequestorProfileData] = useState(null);

  // functions
  const getRequestData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/${match.params.bloodRequestId}/`
      );
      if (res.status === 200) {
        setRequestData(res.data);
        setRequestorProfileData(await getProfileData(res.data.user));
        console.log(res);
      }
    } catch (error) {
      if (error.response.status === 404) {
        dispatch(alert("This blood request is not available 😒", "danger"));
      } else {
        dispatch(alert("Failed to get blood request details 😕", "danger"));
      }
      console.log(error);
    }
  };

  useEffect(async () => {
    dispatch(setProgress(30));
    await getRequestData();
    dispatch(setProgress(100));
  }, []);

  return (
    <>
      <NavWrap>
        <NavTab
          activeClassName="active"
          exact
          to={`/requests/${match.params.bloodRequestId}/`}
        >
          Request
        </NavTab>

        {requestData?.user === auth.user_id ? (
          <NavTab
            activeClassName="active"
            exact
            to={`/requests/${match.params.bloodRequestId}/donors/`}
          >
            Donor Requests
          </NavTab>
        ) : (
          requestData && (
            <NavTab
              activeClassName="active"
              exact
              to={`/requests/${match.params.bloodRequestId}/donor-request/`}
            >
              Your Donor Request
            </NavTab>
          )
        )}
      </NavWrap>

      <Route exact path="/requests/:bloodRequestId/" component={RequestDetails}>
        <RequestDetails
          requestData={requestData}
          requestorProfileData={requestorProfileData}
        />
      </Route>

      {requestData?.user === auth.user_id ? (
        <Route
          exact
          path="/requests/:bloodRequestId/donors/"
          component={DonorRequests}
        />
      ) : (
        requestData && (
          <Route
            exact
            path="/requests/:bloodRequestId/donor-request/"
            component={YourDonorRequest}
          />
        )
      )}
    </>
  );
}

const RequestDetails = ({ match, requestData, requestorProfileData }) => {
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
      <DetailsMap>
        <Map
          coords={requestData?.location}
          isMarkerShown
          googleMapURL=" "
          loadingElement={<div style={{ height: `350px`, width: "100%" }} />}
          containerElement={<div style={{ height: `350px`, width: "100%" }} />}
          mapElement={<div style={{ height: `350px`, width: "100%" }} />}
          defaultZoom={14}
        >
          {<Marker position={requestData?.location} />}
        </Map>
      </DetailsMap>
      <AllDetails>
        <DetailsDiv>
          <DetailHeader>Posted By: </DetailHeader>
          <Profile to={`/profile/${requestData?.user}/`}>
            <ProfileImg
              size="55px"
              style={{ marginRight: "10px" }}
              src={`${process.env.REACT_APP_MEDIA_URL}${requestorProfileData?.profile_img}`}
            />
            <DetailFieldValue>{requestData?.name}</DetailFieldValue>
          </Profile>
          <DetailHeader>Informations: </DetailHeader>
          <Detail>
            <DetailField>Name: </DetailField>
            <DetailFieldValue>{requestData?.name}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Time: </DetailField>
            <DetailFieldValue>{requestData?.date_time}</DetailFieldValue>
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
            {auth?.user_id === requestData?.user ? (
              <>
                <UpdateRequest />
                <Complete />
              </>
            ) : auth?.user_id !== requestData?.user?.id ? (
              <SendDonorRequestForm />
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
            <Badge
              info
              style={{
                position: "absolute",
                width: "max-content",
                right: "6px",
                top: "20px",
              }}
            >
              10 Request Got
            </Badge>
          </Action>
        </ActionDiv>
      </AllDetails>
    </>
  );
};

const SendDonorRequestForm = () => {
  const [autoComplete, setAutoComplete] = useState(null);
  const [coords, setCoords] = useState({});
  const [mark, setMark] = useState(false);

  const [showDonorReqModal, setShowDonorReqModal] = useState(false);

  // hooks
  const profile = useSelector((state) => state.profile);

  function setCurrentLocation() {
    getCurrentLocation((crds) => {
      setMark(crds);
      setCoords(crds);
    });
  }
  useEffect(() => {
    setCurrentLocation();
  }, []);

  const onPlaceChanged = () => {
    try {
      const lat = autoComplete.getPlace().geometry.location.lat();
      const lng = autoComplete.getPlace().geometry.location.lng();
      setMark({ lat, lng });
      setCoords({ lat, lng });
    } catch {}
  };

  const sendRequest = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Button
        disabled={!profile.isCompleted}
        onClick={(e) => setShowDonorReqModal(true)}
        info
      >
        Send Donor Request
      </Button>
      {profile.isCompleted && (
        <form onSubmit={sendRequest}>
          <Modal
            actionText="Request"
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
          >
            <FormWrap>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <InputDiv size={4}>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name" type="text" />
                </InputDiv>
                <InputDiv size={5}>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Email" type="email" />
                </InputDiv>
                <InputDiv size={3}>
                  <Label htmlFor="time">When Do You Need Blood</Label>
                  <Input id="time" placeholder="Time" type="datetime-local" />
                </InputDiv>
                <InputDiv size={6}>
                  <Label htmlFor="number">Phone Number</Label>
                  <Input id="number" placeholder="Phone Number" type="tel" />
                </InputDiv>
                <InputDiv size={6}>
                  <Label htmlFor="add-number">Additional Phone Number</Label>
                  <Input
                    id="add-number"
                    placeholder="Additional Phone Number"
                    type="tel"
                  />
                </InputDiv>

                <InputDiv>
                  <Label htmlFor="add-number">Short Description</Label>
                  <TextArea placeholder="Short Description"></TextArea>
                </InputDiv>

                <InputDiv
                  flex
                  style={{ justifyContent: "space-between" }}
                  size={12}
                >
                  <Button
                    type="button"
                    info
                    blockOnSmall
                    style={{ position: "relative", top: "14px" }}
                    onClick={(e) => {
                      setCurrentLocation();
                    }}
                  >
                    Get Current Location
                  </Button>

                  <Autocomplete
                    onLoad={(autoC) => setAutoComplete(autoC)}
                    onPlaceChanged={onPlaceChanged}
                  >
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
                  size={12}
                >
                  <Map
                    coords={coords}
                    isMarkerShown
                    googleMapURL=" "
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    setCoords={setCoords}
                    setMark={setMark}
                    click={(e) =>
                      setMark({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                    }
                    defaultZoom={17}
                  >
                    {mark ? <Marker position={mark} /> : ""}
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

const Complete = () => {
  // states
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // hooks
  const profile = useSelector((state) => state.profile);

  const sendRequest = (e) => {
    e.preventDefault();
  };
  const secondExample = {
    size: 35,
    count: 5,
    // color: "black",
    activeColor: "var(--primary-color)",
    value: 5,
    a11y: true,
    isHalf: true,
    emptyIcon: <BsStar />,
    halfIcon: <BsStarHalf />,
    filledIcon: <BsStarFill />,
    onChange: (newValue) => {
      console.log(`Example 2: new value is ${newValue}`);
    },
  };

  return (
    <>
      <Button
        disabled={!profile.isCompleted}
        onClick={(e) => setShowCompleteModal(true)}
      >
        Complete
      </Button>
      {profile.isCompleted && (
        <form onSubmit={sendRequest}>
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
          >
            <FormWrap>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <InputDiv>
                  <Label htmlFor="add-number">
                    Express your experience with this Donor
                  </Label>
                  <TextArea placeholder="Short Description"></TextArea>
                </InputDiv>
                <InputDiv>
                  <Label htmlFor="add-number">
                    Express your experience with this Donor
                  </Label>
                  <ReactStars
                    style={{ marginTop: "11px" }}
                    {...secondExample}
                  />
                </InputDiv>
              </Form>
            </FormWrap>
          </Modal>
        </form>
      )}
    </>
  );
};

const UpdateRequest = () => {
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
  const [coords, setCoords] = useState({});
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
        setCoords({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
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
      setCoords({ lat, lng });
    } catch {}
  };

  // form data submit
  const defaultRequestFormData = {
    name: "",
    email: "",
    user: auth.user_id,
    date_time: "",
    number: "",
    add_number: "",
    blood_group: "",
    location: mark,
    location_name: "",
  };
  const [makeRequestFormData, setMakeRequestFormData] = useState({
    name: "",
    email: "",
    user: auth.user_id,
    date_time: "",
    number: "",
    add_number: "",
    blood_group: "",
    location: mark,
    location_name: "",
    description: "",
  });
  useEffect(() => {
    setMakeRequestFormData({ ...makeRequestFormData, location: mark });
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
  } = makeRequestFormData;

  const onChange = (e) =>
    setMakeRequestFormData({
      ...makeRequestFormData,
      [e.target.name]: e.target.value,
    });

  const submitMakeRequest = async (e) => {
    e.preventDefault();
    dispatch(setProgress(10));
    console.log(makeRequestFormData);
    try {
      dispatch(setProgress(20));

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/`,
        makeRequestFormData
      );
      dispatch(setProgress(70));
      console.log(res);
      if (res?.status === 201) {
        dispatch(
          alert("Your Blood Request Was Posted Successfully", "success")
        );
        setMakeRequestFormData(defaultRequestFormData);
        dispatch(setProgress(90));
        history.push(`/requests/${res.data.id}/`);
      }
    } catch (err) {
      console.log(err);
      dispatch(alert("Failed to post your blood request", "danger"));
    }
    dispatch(setProgress(100));
  };

  return (
    <>
      <Button
        disabled={!profile.isCompleted}
        onClick={(e) => setShowUpdateRequestModal(true)}
        info
      >
        Update
      </Button>
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
        wrapStyle={{alignItems: "start"}}
      >
        <FormWrap>
          <Form onSubmit={submitMakeRequest}>
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
                value={date_time}
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
                defaultValue={bloodGroups[0]}
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
                  setMakeRequestFormData({
                    ...makeRequestFormData,
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
                placeholder="Description"
              ></TextArea>
            </InputDiv>

            <InputDiv
              flex
              style={{ justifyContent: "space-between" }}
              size={12}
            >
              <Button
                type="button"
                info
                blockOnSmall
                style={{ position: "relative", top: "14px" }}
                onClick={(e) => {
                  setCurrentLocation();
                }}
              >
                Current Location
              </Button>

              <Autocomplete
                onLoad={(autoC) => setAutoComplete(autoC)}
                onPlaceChanged={onPlaceChanged}
              >
                <>
                  <Label htmlFor="add-number">Where do you need blood? *</Label>
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
              size={12}
            >
              <Map
                coords={coords}
                isMarkerShown
                googleMapURL=" "
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                setCoords={setCoords}
                setMark={setMark}
                click={(e) =>
                  setMark({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                }
                defaultZoom={17}
              >
                {mark ? <Marker position={mark} /> : ""}
              </Map>
            </InputDiv>
 
          </Form>
        </FormWrap>
      </Modal>
    </>
  );
};

const DonorRequests = () => {
  // eslint-disable-next-line
  const [donorRequestData, setDonorRequestData] = useState([]);
  const [showDonorRequest, setShowDonorRequest] = useState(false);
  const [donorRequestMoreDetails, setDonorRequestMoreDetails] = useState(null);
  const [showEmail, setShowEmail] = useState(true);
  const report = () => {
    // call api to report this request
    console.log("report request");
  };

  // eslint-disable-next-line
  const [dropDownOptions, setDropDownOptions] = useState([
    { name: "Report", icon: FaBan, onClick: report },
  ]);

  window.addEventListener("resize", (e) => {
    if (window.innerWidth <= 550) {
      setShowEmail(false);
    } else {
      setShowEmail(true);
    }
  });
  useEffect(() => {
    setDonorRequestData([
      {
        Name: "Jimam Tamimi",
        Time: "23 th april 2021",
        Distance: "2 km",
      },
    ]);
  }, []);

  const showMoreDetails = (id) => {
    // call the apis
    setShowDonorRequest(true);
    setDonorRequestMoreDetails({});
  };
  const onCanvasExit = () => {
    setTimeout(() => {
      setDonorRequestMoreDetails(null);
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

            <Tr onClick={(e) => showMoreDetails(90)}>
              <Td>1</Td>
              <Td>
                {" "}
                <Link
                  style={{ display: "flex", alignItems: "center" }}
                  to="/user/23/"
                >
                  <ProfileImg size="45px" src={logo} />{" "}
                  <p
                    style={{
                      position: "relative",
                      left: "15px",
                      fontWeight: "600",
                    }}
                  >
                    Jimam Tamimi
                  </p>{" "}
                </Link>{" "}
              </Td>
              <Td>2 april 2021 4:30 pm </Td>
              <Td>2 KM</Td>
              <Td>01827485748</Td>
              {showEmail ? <Td>jimam@jimam.com</Td> : ""}
            </Tr>
          </HtmlTable>
        </BottomSection>
        <OffCanvas
          onCanvasExit={onCanvasExit}
          setShow={setShowDonorRequest}
          show={showDonorRequest}
        >
          {donorRequestMoreDetails ? (
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
                    to="/user/23/"
                  >
                    <ProfileImg size="45px" src={logo} />{" "}
                    <p
                      style={{
                        position: "relative",
                        left: "15px",
                        fontWeight: "600",
                      }}
                    >
                      Jimam Tamimi
                    </p>{" "}
                  </Link>
                </Detail>

                <DetailHeader>Informations: </DetailHeader>
                <Detail>
                  <DetailField>Name: </DetailField>
                  <DetailFieldValue>Jimam</DetailFieldValue>
                </Detail>
                <Detail>
                  <DetailField>Time: </DetailField>
                  <DetailFieldValue>24 October 2021 2:30 pm</DetailFieldValue>
                </Detail>
                <Detail>
                  <DetailField>Distance: </DetailField>
                  <DetailFieldValue>4 KM</DetailFieldValue>
                </Detail>

                <DetailHeader>Contacts: </DetailHeader>
                <Detail>
                  <DetailField>Email: </DetailField>
                  <DetailFieldValue>jimam@jimam.com</DetailFieldValue>
                </Detail>
                <Detail>
                  <DetailField>Number: </DetailField>
                  <DetailFieldValue>0199483748</DetailFieldValue>
                </Detail>
                <Detail>
                  <DetailField>Additional Number: </DetailField>
                  <DetailFieldValue>017384738</DetailFieldValue>
                </Detail>

                <DetailHeader>Description: </DetailHeader>
                <Detail>
                  <DetailFieldValue>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsum cumque molestiae asperiores alias maxime! Ea
                    aspernatur sed libero laudantium odit molestias tempore
                    deleniti odio perferendis modi? Magnam praesentium impedit
                    quasi voluptates molestiae ipsam quos cumque sed facere
                    repellat sapiente sunt, eligendi non animi iusto, quam
                    consequuntur? Aliquid accusamus quos nostrum.
                  </DetailFieldValue>
                </Detail>
                <DetailHeader>Actions: </DetailHeader>
                <ButtonDiv>
                  <Button sm info>
                    Accept
                  </Button>
                  <Button sm>Reject</Button>
                </ButtonDiv>
              </DetailsDiv>
            </AllDetails>
          ) : (
            ""
          )}
        </OffCanvas>
      </Wrap>
    </>
  );
};

const YourDonorRequest = () => {
  // eslint-disable-next-line
  const [details, setDetails] = useState({
    name: "Jimam Tamimi",
    time: "02/1/2006",
    bloodGroup: "A+",
    number: "92374857837",
    addNumber: "4656564547",
    email: "jimamtamimi12@gmail.com",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima qui minus assumenda, accusantium quidem maiores sapiente ipsum. Eligendi illo dolore ",
    coords: { lat: 24.0077202, lng: 89.2429551 },
  });
  const [autoComplete, setAutoComplete] = useState(null);
  const [coords, setCoords] = useState({ lat: 24.0077202, lng: 89.2429551 });
  const [mark, setMark] = useState(false);
  function setCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        setCoords({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
        setMark({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      },
      () => console.log("error :)"),
      { timeout: 30000 }
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
      setCoords({ lat, lng });
    } catch {}
  };

  // const {name, time, bloodGroup, number, addNumber, email, description, cords} = details

  const upDateRequest = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <DetailsMap>
        <Map
          coords={details.coords}
          isMarkerShown
          googleMapURL=" "
          loadingElement={<div style={{ height: `350px`, width: "100%" }} />}
          containerElement={<div style={{ height: `350px`, width: "100%" }} />}
          mapElement={<div style={{ height: `350px`, width: "100%" }} />}
          defaultZoom={14}
        >
          {<Marker position={details.coords} />}
        </Map>
      </DetailsMap>
      <AllDetails>
        <DetailsDiv>
          <DetailHeader>Informations: </DetailHeader>
          <Detail>
            <DetailField>Name: </DetailField>
            <DetailFieldValue>{details.name}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Time: </DetailField>
            <DetailFieldValue>{details.time}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Blood Group: </DetailField>
            <DetailFieldValue>{details.bloodGroup}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Number: </DetailField>
            <DetailFieldValue>{details.number}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Additional Number: </DetailField>
            <DetailFieldValue>{details.number}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Email: </DetailField>
            <DetailFieldValue>{details.email}</DetailFieldValue>
          </Detail>

          <DetailHeader>Description: </DetailHeader>
          <Detail>
            <DetailFieldValue>{details.description}</DetailFieldValue>
          </Detail>
          <ButtonDiv>
            <form onSubmit={upDateRequest}>
              <Modal
                actionText="Update"
                title="Update Request Form"
                lg
                info
                btnText="Update"
              >
                <FormWrap>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <InputDiv size={4}>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Name" type="text" />
                    </InputDiv>
                    <InputDiv size={5}>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" placeholder="Email" type="email" />
                    </InputDiv>
                    <InputDiv size={3}>
                      <Label htmlFor="time">When Do You Need Blood</Label>
                      <Input
                        id="time"
                        placeholder="Time"
                        type="datetime-local"
                      />
                    </InputDiv>
                    <InputDiv size={6}>
                      <Label htmlFor="number">Phone Number</Label>
                      <Input
                        id="number"
                        placeholder="Phone Number"
                        type="tel"
                      />
                    </InputDiv>
                    <InputDiv size={6}>
                      <Label htmlFor="add-number">
                        Additional Phone Number
                      </Label>
                      <Input
                        id="add-number"
                        placeholder="Additional Phone Number"
                        type="tel"
                      />
                    </InputDiv>

                    <InputDiv>
                      <Label htmlFor="add-number">Short Description</Label>
                      <TextArea placeholder="Short Description"></TextArea>
                    </InputDiv>

                    <InputDiv
                      flex
                      style={{ justifyContent: "space-between" }}
                      size={12}
                    >
                      <Button
                        type="button"
                        info
                        blockOnSmall
                        style={{ position: "relative", top: "14px" }}
                        onClick={(e) => {
                          setCurrentLocation();
                        }}
                      >
                        Get Current Location
                      </Button>

                      <Autocomplete
                        onLoad={(autoC) => setAutoComplete(autoC)}
                        onPlaceChanged={onPlaceChanged}
                      >
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
                        boxShadow:
                          "0px 0px 15px 2px var(--main-box-shadow-color)",
                      }}
                      height="400px"
                      size={12}
                    >
                      <Map
                        coords={coords}
                        isMarkerShown
                        googleMapURL=" "
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        setCoords={setCoords}
                        setMark={setMark}
                        click={(e) =>
                          setMark({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                        }
                        defaultZoom={17}
                      >
                        {mark ? <Marker position={mark} /> : ""}
                      </Map>
                    </InputDiv>
                  </Form>
                </FormWrap>
              </Modal>
            </form>
          </ButtonDiv>
        </DetailsDiv>
        <ActionDiv>
          <Action>
            <Badge
              info
              style={{
                position: "absolute",
                width: "max-content",
                right: "6px",
                top: "20px",
              }}
            >
              10 Request Got
            </Badge>
          </Action>
        </ActionDiv>
      </AllDetails>
    </>
  );
};
