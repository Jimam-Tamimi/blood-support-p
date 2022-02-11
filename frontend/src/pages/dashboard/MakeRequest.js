import React, { useState, useEffect } from "react";
import {
  FormWrap,
  Form,
  InputDiv,
  Input,
  customStyles,
  Label,
  TextArea,
} from "../../styles/Form.styles";

import { Button } from "../../styles/Essentials.styles";

import { Autocomplete } from "@react-google-maps/api";
import { Marker } from "react-google-maps";
import Select from "react-select";
import Map from "../../components/Map/Map";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import alert from "../../redux/alert/actions";

import { setProgress } from "../../redux/progress/actions";
import { useHistory } from "react-router-dom"; 

export default function MakeRequest() {
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

  // hooks
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory()

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
  }
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

  const { name, email, date_time, number, add_number, blood_group, timestamp, description } =
    makeRequestFormData

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
        makeRequestFormData,
        
      );
      dispatch(setProgress(70));
      console.log(res);
      if (res?.status === 201) {
        dispatch(alert("Your Blood Request Was Posted Successfully", "success"));
        setMakeRequestFormData(defaultRequestFormData)
        dispatch(setProgress(90));
        history.push(`/requests/${res.data.slug}/`)
      }
    } catch (err) {
      console.log(err);
      dispatch(alert("Failed to post your blood request", "danger"));
    }
    dispatch(setProgress(100));
  };

  return (
    <>
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
              value={date_time}
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
          <InputDiv size={3}>
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
            />
          </InputDiv>


          <InputDiv>
              <Label>Description</Label>
              <TextArea onChange={onChange} name="description" value={description} height="200px" placeholder="Description"></TextArea>
          </InputDiv>

          

          <InputDiv flex style={{ justifyContent: "space-between" }} size={12}>
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

          <InputDiv
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
            size={12}
          >
            <Button blockOnSmall>Request</Button>
          </InputDiv>
        </Form>
      </FormWrap>
    </>
  );
}
