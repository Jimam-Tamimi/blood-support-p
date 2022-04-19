import { Autocomplete } from "@react-google-maps/api";
import { Marker } from "react-google-maps";
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";

import Map from "../../components/Map/Map";

import {
  ProfileImg,
  ButtonDiv,
  Badge,
  Button,
  ButtonLink,
} from "../../styles/Essentials.styles";

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
  DetailsAlert,
} from "../../styles/Details.styles";
import Dropdown from "../../components/Dropdown/Dropdown";

import { NavWrap, NavTab } from "../../styles/Nav.styles";

import { FaBan } from "react-icons/fa";
import { Route, useHistory, useLocation } from "react-router";

import prof from "../../assets/img/prof.jpg";
import {
  ProfileImgDiv,
  ReviewContent,
  ReviewDiv,
  ReviewWrap,
} from "../styles/dashboard/Profile.styles";
import { useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import {
  customStyles,
  Form,
  FormWrap,
  Input,
  InputDiv,
  Label,
  TextArea,
} from "../../styles/Form.styles";
import { getCurrentLocation, messageToUser } from "../../helpers";
import Select from "react-select";
import ImageUpload from "../../components/ImageUpload/ImageUpload";

import { useDispatch, useSelector } from "react-redux";
import alert from "../../redux/alert/actions";
import axios from "axios";
import { getProfileDetails } from "../../redux/profile/actions";

import { setProgress } from "../../redux/progress/actions";
import { addProfileToFavorites, addUserToFavorites, getProfileDetailsForUser, removeUserFromFavorites } from "../../apiCalls";
import useModal from "../../hooks/useModal";
import ReportForm from "../../components/ReportForm";

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

export default function Profile({ match }) {
  // hooks
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (
      location.pathname === `/profile/${match.params.id}/` ||
      location.pathname === `/profile/${match.params.id}`
    ) {
      history.replace(`/profile/${match.params.id}/details/`, {});
    }
    // eslint-disable-next-line
  }, [location]);

  const getProfile = async () => {
    try {
      const res = await getProfileDetailsForUser(match?.params?.id, false);
      if (res.status === 200) {
        setProfile(res.data);
      }
    } catch (error) {
      if (
        error?.response?.data?.status === false &&
        error?.response?.data?.code === "profile_not_found"
      ) {
        setProfile(error?.response?.data?.code);
      } else if (
        error?.response?.data?.status === false &&
        error?.response?.data?.code === "user_not_found"
      ) {
        setProfile(error?.response?.data?.code);
      }
    }
  };

  useEffect(async () => {
    dispatch(setProgress(20));
    await getProfile();
    dispatch(setProgress(100));
    console.log(profile);
  }, []);

  if (profile === "user_not_found") {
    return (
      <NotAvailableWrap>
        <h2>404 user not found</h2>
      </NotAvailableWrap>
    );
  } else {
    return (
      <>
        {profile === "profile_not_found" && (
          <DetailsAlert type="danger">
            <p>Your Profile is not completed</p>
          </DetailsAlert>
        )}
        <DetailsMap>
          <Map
            coords={profile?.location}
            isMarkerShown
            googleMapURL=" "
            loadingElement={<div style={{ height: `350px`, width: "100%" }} />}
            containerElement={
              <div style={{ height: `350px`, width: "100%" }} />
            }
            mapElement={<div style={{ height: `350px`, width: "100%" }} />}
            defaultZoom={14}>
            {<Marker position={profile?.location} />}
          </Map>
        </DetailsMap>
        <ProfileImgDiv>
          <ProfileImg
            src={`${profile?.profile_img}`}
            size="130px"
            style={{ position: "absolute", bottom: "15px", left: "15px" }}
          />
        </ProfileImgDiv>

        <NavWrap>
          <NavTab
            activeClassName="active"
            exact
            to={`/profile/${match.params.id}/details/`}>
            Details
          </NavTab>
          <NavTab
            activeClassName="active"
            to={`/profile/${match.params.id}/review/`}>
            Review
          </NavTab>
        </NavWrap>

        <Route exact path="/profile/:id/details/">
          <Details getProfile={getProfile} profile={profile} setProfile={setProfile} />
        </Route>

        <Route path="/profile/:id/review/" component={Review} />
      </>
    );
  }
}

function Details({ profile, getProfile, setProfile }) {
  const [showUpdateFormModal, setShowUpdateFormModal] = useState(false);
  const modalController = useModal();

  // hooks
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const history = useHistory();

  const report = () => {
    // call api to report this request
    console.log(profile)
    modalController.showModal(<ReportForm formId='user-report' data={{user_id: profile?.user?.id}} onSuccess={ () => {
      profile.user.is_reported = true
      setProfile({...profile } ) }} />)

  };
  const dropDownOptions = [
    id != auth.user_id &&
     { name: profile?.user?.is_reported ? "Reported" : "Report", icon: <FaBan />, onClick: !profile?.user?.is_reported ? report : () => '', disabled: profile?.user?.is_reported },

    !profile?.user?.is_favorite ? { name: "Add To Favorites", icon: <FaBan />, onClick: () => addUserToFavorites(profile?.user?.id).then(res => {profile.user.is_favorite = true; setProfile({ ...profile})}).catch() } : { name: "Remove From Favorites", icon: <FaBan />, onClick: () => removeUserFromFavorites(profile?.user?.id).then(res => {profile.user.is_favorite = false; setProfile({ ...profile})}).catch() },

  ]

  

  return (
    <>
      <AllDetails>
        <DetailsDiv>
          <DetailHeader>Details: </DetailHeader>
          <Detail>
            <DetailField>Name: </DetailField>
            <DetailFieldValue>{profile?.name}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Blood Group: </DetailField>
            <DetailFieldValue>{profile?.blood_group}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Email: </DetailField>
            <DetailFieldValue>{profile?.email}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Address: </DetailField>
            <DetailFieldValue>{profile?.address}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Number: </DetailField>
            <DetailFieldValue>{profile?.number}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Additional Number: </DetailField>
            <DetailFieldValue>{profile?.add_number}</DetailFieldValue>
          </Detail>
          <DetailHeader>Details: </DetailHeader>

          <Detail>
            <DetailFieldValue>{profile?.description}</DetailFieldValue>
          </Detail>
          {id == auth?.user_id ? (
            <ButtonDiv style={{ marginTop: "20px" }}>
              <Button
                onClick={(e) => setShowUpdateFormModal(true)}
                type="button">
                {profile.isCompleted ? "Update Profile" : "Complete Profile"}
              </Button>
              <Modal
                btnText="Update Profile"
                title="Update Profile"
                actionText="Update"
                formId="updateProfileForm"
                md
                wrapStyle={{ alignItems: "baseline" }}
                scale
                closeOnOutsideClick={false}
                show={showUpdateFormModal}
                setShow={setShowUpdateFormModal}>
                <UpdateAndCompleteProfileForm
                  setShowUpdateFormModal={setShowUpdateFormModal}
                  getProfile={getProfile}
                />
              </Modal>
            </ButtonDiv>
          ) :
          <Button onClick={e => messageToUser(profile.user.id, history)} info>Message</Button>

          }
        </DetailsDiv>
        <ActionDiv>
          <Action>
            <Dropdown options={dropDownOptions} />
          </Action>
          <Action>
            {/* <Badge
              info
              style={{
                position: "absolute",
                width: "max-content",
                right: "6px",
                top: "20px",
              }}>
              New Member
            </Badge> */}
          </Action>
        </ActionDiv>
      </AllDetails>
    </>
  );
}

function UpdateAndCompleteProfileForm({ setShowUpdateFormModal, getProfile }) {
  // hooks
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  // states
  const [autoComplete, setAutoComplete] = useState(null);
  const [submitReq, setSubmitReq] = useState(false);
  const initialProfileData = {
    name: "",
    email: "",
    address: "",
    number: "",
    add_number: "",
    blood_group: "",
    description: "",
    coords: {},
    profile_img: "",
  };
  const [profileFormData, setProfileFormData] = useState(initialProfileData);
  useEffect(async () => {
    getCurrentLocation((crds) => {
      setProfileFormData({ ...profileFormData, coords: crds });
      setMark(crds);
    });
  }, []);
  const {
    name,
    email,
    address,
    number,
    add_number,
    blood_group,
    description,
    coords,
    profile_img,
  } = profileFormData;
  const [mark, setMark] = useState();

  // get data if profile is completed

  useEffect(async () => {
    if (profile?.isCompleted) {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}api/account/profile/${profile.id}/`
        );
        if (res.status === 200) {
          setProfileFormData({
            ...res.data,
            coords: res.data.location,
            email: res.data?.user?.email,
            profile_img: null,
          });
          setMark(res.data.location);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [profile]);

  const onChange = (e) =>
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });

  const onPlaceChanged = () => {
    try {
      const lat = autoComplete.getPlace().geometry.location.lat();
      const lng = autoComplete.getPlace().geometry.location.lng();
      setProfileFormData({
        ...profileFormData,
        coords: { lat: lat, lng: lng },
      });
    } catch { }
  };

  const onSubmitUpdateProfile = async (e, values) => {
    e.preventDefault();
    setSubmitReq(true);
    for (let member in profileFormData) {
      if (!profileFormData[member]) {
        if (profile?.isCompleted && member === "profile_img") {
          continue;
        }

        dispatch(alert(member + " Should Not Be Blank 😒", "danger"));
        return;
      }
    }
    dispatch(setProgress(20));

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("number", number);
      formData.append("add_number", add_number);
      formData.append("blood_group", blood_group);
      formData.append("description", description);
      if (profile_img) {
        formData.append("profile_img", profile_img);
      }
      formData.append("location", JSON.stringify(mark));
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      let res = null;
      if (!profile?.isCompleted) {
        res = await axios.post(
          `${process.env.REACT_APP_API_URL}api/account/profile/`,
          formData,
          config
        );
      } else {
        res = await axios.put(
          `${process.env.REACT_APP_API_URL}api/account/profile/${profile.id}/`,
          formData,
          config
        );
      }
      dispatch(setProgress(70));

      if (res?.status === 201 || res?.status === 200) {
        dispatch(alert("Profile Updated Successfully 😎", "success"));
        setShowUpdateFormModal(false);
        setSubmitReq(false);
        setProfileFormData(formData);
        getProfile();
        dispatch(getProfileDetails());
      }
    } catch (err) {
      console.log(err.response);
    }
    dispatch(setProgress(100));
    console.log(profileFormData);
  };

  return (
    <>
      <FormWrap>
        <Form
          id="updateProfileForm"
          onSubmit={onSubmitUpdateProfile}
          enctype="multipart/form-data">
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
          <InputDiv size={4}>
            <Label
              htmlFor="blood-group"
              showAlert={submitReq && !blood_group ? true : false}>
              Blood Group{" "}
            </Label>
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
                setProfileFormData({
                  ...profileFormData,
                  blood_group: e?.value,
                })
              }
            />
          </InputDiv>

          <InputDiv>
            <Label>Description</Label>
            <TextArea
              onChange={onChange}
              name="description"
              value={description}
              height="200px"
              placeholder="Description"></TextArea>
          </InputDiv>

          <InputDiv>
            <Label
              showAlert={
                submitReq && !profile_img && !profile?.isCompleted
                  ? true
                  : false
              }>
              Profile Image
            </Label>
            <ImageUpload
              style={{ background: "var(--input-bg-color)" }}
              setImage={(image) =>
                setProfileFormData({
                  ...profileFormData,
                  profile_img: image[0]?.file,
                })
              }
              image={profile_img}
            />
          </InputDiv>

          <InputDiv flex style={{ justifyContent: "space-between" }} size={12}>
            <Button
              type="button"
              info
              blockOnSmall
              style={{ position: "relative", top: "14px" }}
              onClick={async (e) => {
                getCurrentLocation((crds) => {
                  setProfileFormData({ ...profileFormData, coords: crds });
                  setMark(crds);
                });
              }}>
              Current Location
            </Button>

            <Autocomplete
              onLoad={(autoC) => setAutoComplete(autoC)}
              onPlaceChanged={onPlaceChanged}>
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
            size={12}>
            <Map
              coords={coords}
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

          <InputDiv
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
            size={12}>
            {/* <Button blockOnSmall>Update</Button> */}
          </InputDiv>
        </Form>
      </FormWrap>
    </>
  );
}

function Review({ match }) {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === `/profile/${match.params.id}/review/` ||
      location.pathname === `/profile/${match.params.id}/review`
    ) {
      history.push(`/profile/${match.params.id}/review/as-requestor/`);
    }
    // eslint-disable-next-line
  }, [location]);

  return (
    <>
      <NavWrap>
        <NavTab
          activeClassName="active"
          exact
          to={`/profile/${match.params.id}/review/as-requestor/`}>
          Review As Requestor
        </NavTab>
        <NavTab
          activeClassName="active"
          exact
          to={`/profile/${match.params.id}/review/as-donor/`}>
          Review As Donor
        </NavTab>
      </NavWrap>

      <Route exact path="/profile/:id/review/as-requestor/">
        <RequestorReview />
      </Route>

      <Route exact path="/profile/:id/review/as-donor">
        <DonorReview />
      </Route>
    </>
  );
}

function RequestorReview() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    setReviews([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
  }, []);

  const firstExample = {
    size: 30,
    value: 2.5,
    edit: false,
    activeColor: "var(--primary-color)",
  };

  return (
    <>
      <ReviewWrap>
        {reviews?.map((review, index) => (
          <>
            <ReviewDiv key={index} to="/requests/545/">
              <ProfileImg size="100px" src={prof} />
              <ReviewContent>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3 style={{ color: "var(--secendory-text-color)" }}>
                    Jimam Tamimi
                  </h3>
                  <div
                    style={{
                      position: "relative",
                      bottom: "2px",
                      left: "18px",
                    }}>
                    <ReactStars {...firstExample} />
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--secendory-text-color)",
                  }}>
                  aa quick brown fox jumped over the lazy doga quick brown fox
                  jumped over the lazy doga quick brown fox jumped over the lazy
                  doga quick brown fox jumped over the lazy doga quick brown fox
                  jumped over the lazy doga quick brown fox jumped over the lazy
                  doga quick brown fox jumped over the lazy dog quick brown fox
                  jumped over the lazy dog
                </p>
              </ReviewContent>
              <Badge
                sm
                style={{ position: "absolute", bottom: "13px", right: "18px" }}>
                3 days ago
              </Badge>
            </ReviewDiv>
          </>
        ))}
      </ReviewWrap>
    </>
  );
}

function DonorReview() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    setReviews([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
  }, []);

  const firstExample = {
    size: 30,
    value: 2.5,
    edit: false,
    activeColor: "var(--primary-color)",
  };

  return (
    <>
      <ReviewWrap>
        {reviews?.map((review, index) => (
          <>
            <ReviewDiv key={index} to="/requests/545/">
              <ProfileImg size="100px" src={prof} />
              <ReviewContent>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3 style={{ color: "var(--secendory-text-color)" }}>
                    Jimam Tamimi
                  </h3>
                  <div
                    style={{
                      position: "relative",
                      bottom: "2px",
                      left: "18px",
                    }}>
                    <ReactStars {...firstExample} />
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--secendory-text-color)",
                  }}>
                  aa quick brown fox jumped over the lazy doga quick brown fox
                  jumped over the lazy doga quick brown fox jumped over the lazy
                  doga quick brown fox jumped over the lazy doga quick brown fox
                  jumped over the lazy doga quick brown fox jumped over the lazy
                  doga quick brown fox jumped over the lazy dog quick brown fox
                  jumped over the lazy dog
                </p>
              </ReviewContent>
              <Badge
                sm
                style={{ position: "absolute", bottom: "13px", right: "18px" }}>
                3 days ago
              </Badge>
            </ReviewDiv>
          </>
        ))}
      </ReviewWrap>
    </>
  );
}
