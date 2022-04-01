import React, { useEffect, useState } from "react";
import BloodRequest from "../../components/BloodRequest/BloodRequest";
import OffCanvas from "../../components/OffCanvas/OffCanvas";
import styled from "styled-components";
import {
  Badge,
  ButtonLink,
  Profile,
  ProfileImg,
} from "../../styles/Essentials.styles";

import { Flex } from "../../globalStyles";
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
import { FaBan } from "react-icons/fa";
import { Marker } from "@react-google-maps/api";
import Dropdown from "../../components/Dropdown/Dropdown";
import axios from "axios";
import { getProfileData } from "../../helpers";
import { useDispatch } from "react-redux";
import alert from "../../redux/alert/actions";
import { getBloodRequestData, getProfileDetailsForUser } from "../../apiCalls";

export default function HelpPeople() {
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  // eslint-disable-next-line
  const [bloodRequestId, setBloodRequestId] = useState(null);
 

  
  // get all request data
  const [allRequests, setAllRequests] = useState([])
  const getAllBloodRequest = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/blood/blood-request/`);
      if(res.status === 200) {
        console.log(res)
        setAllRequests(res.data);
      }
    } catch (error) {
        console.log(error.response);
    }
  }

  useEffect(() => {
    getAllBloodRequest();
  }, [])
  

  
  return (
    <>
      <OffCanvas setShow={setShowRequestDetails} show={showRequestDetails}>
        <RequestDetails bloodRequestId={bloodRequestId} />
      </OffCanvas>
      <Wrap>

        {
          allRequests.map((requestData, i) => (
            <BloodRequest
            key={i}
              setShowRequestDetails={setShowRequestDetails}
              setBloodRequestId={setBloodRequestId}
              requestData={requestData}
            />            
          ))
        }
        
 
      </Wrap>
    </>
  );
}

const RequestDetails = ({bloodRequestId}) => {

  const [requestData, setRequestData] = useState({});
  
  //  hooks
  const dispatch = useDispatch();

  
  const report = () => {
    // call api to report this request
    console.log("report request");
  };
  const [dropDownOption, setDropDownOption] = useState([
    { name: "Report", icon: FaBan, onClick: report },
  ]); 

  // functions
  // get blood request data using id
 
  
  useEffect( async () => {
    if(bloodRequestId){
      const res = await getBloodRequestData(bloodRequestId);
      console.log({res})
      if(res.status === 200) {
        const userDataRes = await getProfileDetailsForUser(res?.data?.user?.id)
        setRequestData({ ...res.data, userData: userDataRes.data });
      } 

    }
  }, [bloodRequestId])
  
  
  
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
          <Profile to={`/profile/${requestData?.userData?.user?.id}/`}>
            <ProfileImg
              size="55px"
              style={{ marginRight: "10px" }}
              src={`${process.env.REACT_APP_MEDIA_URL}${requestData?.userData?.profile_img}`}
            />
            <DetailFieldValue className="profile-link-name" >{requestData?.userData?.name}</DetailFieldValue>
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
            <ButtonLink
              to={`/requests/${requestData.id}/`}
              style={{ padding: "10px 15px", margin: "0" }}
            >
              View
            </ButtonLink>
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

const Wrap = styled.div`
  ${Flex}
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;

  /* @media only screen and (max-width: 1254px){
      &{
          justify-content: center;
      }
    } */
`;

const ButtonDiv = styled.div`
  margin-top: 30px;
`;
