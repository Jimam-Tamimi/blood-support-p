import React, {useState, useEffect} from "react";
import {
  FormWrap,
  Form,
  InputDiv,
  Input,
  customStyles,
  Label,
} from "../../styles/Form.styles";

import { Button } from "../../styles/Essentials.styles";

import {Autocomplete} from '@react-google-maps/api'
import {Marker} from "react-google-maps";
import Select from "react-select";
import Map from "../../components/Map/Map"; 

export default function MakeRequest() {
  const bloodGroups = [
    { value: "Select", label: "Select" },
    { value: "a+", label: "A+" },
    { value: "b+", label: "B+" },
    { value: "ab+", label: "AB+" },
    { value: "o+", label: "O+" },
    { value: "a-", label: "A-" },
    { value: "b-", label: "B-" },
    { value: "ab-", label: "AB-" },
    { value: "o-", label: "O-" },
  ];

  const [autoComplete, setAutoComplete] = useState(null)
  const [coords, setCoords] = useState({})
  const [mark, setMark] = useState(false)
  function setCurrentLocation(){
    
    navigator.geolocation.getCurrentPosition((location) => {
      setCoords({lat: location.coords.latitude, lng: location.coords.longitude})
      setMark({lat: location.coords.latitude, lng: location.coords.longitude})
    }, () => console.log('error :)'), {timeout:10000})
  }
  useEffect(() => {
    setCurrentLocation()
  }, [])
 

  const onPlaceChanged = () => {
    try{
      const lat = autoComplete.getPlace().geometry.location.lat();
      const lng = autoComplete.getPlace().geometry.location.lng();
      setMark({lat, lng})
      setCoords({lat, lng})
    } catch{
      
    }
  } 
  
  return (
    <>
      <FormWrap>
        <Form onSubmit={e => {  e.preventDefault()}}>
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
          <InputDiv size={3}>
            <Label htmlFor="number">Phone Number</Label>
            <Input id="number" placeholder="Phone Number" type="tel" />
          </InputDiv>
          <InputDiv size={3}>
            <Label htmlFor="add-number">Additional Phone Number</Label>
            <Input
              id="add-number"
              placeholder="Additional Phone Number"
              type="tel"
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
            />
          </InputDiv>
          

          <InputDiv flex  style={{justifyContent: 'space-between'}} size={12}>

            <Button  type="button"   info blockOnSmall style={{position: "relative", top: "14px"}} onClick={e => {   setCurrentLocation()} }  >Current Location</Button>

            <Autocomplete onLoad={autoC => setAutoComplete(autoC)} onPlaceChanged={onPlaceChanged}>
              <>
              <Label htmlFor="add-number">Where do you need blood? *</Label>
              <Input
                id="places"
                placeholder="Search Places..."
                type="text"
                onKeyDown={e => {if(e.keyCode===13){e.preventDefault()}else{return true}}}
              /> 
              </>
            </Autocomplete>
          </InputDiv>
  
          <InputDiv style={{boxShadow: "0px 0px 15px 2px var(--main-box-shadow-color)"}} height="400px" size={12}>
            <Map 
              coords={coords}  
              isMarkerShown
              googleMapURL=" "
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              setCoords={setCoords}
              setMark={setMark}
              click={e => setMark({lat: e.latLng.lat(), lng: e.latLng.lng()})}
              defaultZoom={17}
            >
              {
                mark?<Marker  
                position={mark} 
                /> : ''
              }
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
