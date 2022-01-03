import React, { useState } from "react";
import BloodRequest from "../../components/BloodRequest/BloodRequest";
import OffCanvas from "../../components/OffCanvas/OffCanvas";
import styled from "styled-components";
import {
  Badge,
  Button,
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

export default function HelpPeople() {
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [requestId, setRequestId] = useState(null);
  return (
    <>
      <OffCanvas setShow={setShowRequestDetails} show={showRequestDetails}>
        <RequestDetails />
      </OffCanvas>
      <Wrap>
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
        <BloodRequest
          setShowRequestDetails={setShowRequestDetails}
          setRequestId={setRequestId}
        />
      </Wrap>
    </>
  );
}

const RequestDetails = () => {
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
  const report = () => {
    // call api to report this request
    console.log("report request");
  };

  const [dropDownOption, setDropDownOption] = useState([
    { name: "Report", icon: FaBan, onClick: report },
  ]);

  const [cords, setCords] = useState({ lat: 24.0077202, lng: 89.2429551 });

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
          {<Marker position={cords} />}
        </Map>
      </DetailsMap>
      <AllDetails>
        <DetailsDiv>
          <DetailHeader>Posted By: </DetailHeader>
          <Profile to="/">
            <ProfileImg src={""} />
            <DetailFieldValue>{details.name}</DetailFieldValue>
          </Profile>
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
            <ButtonLink
              to="/requests/45/"
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
