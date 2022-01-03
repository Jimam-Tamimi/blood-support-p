import React, { useState } from "react";
import { Route, useHistory, useLocation } from "react-router";
import { NavTab, NavWrap,  } from "../../styles/Nav.styles";
import { Button, Profile } from "../../styles/Essentials.styles";
import { Link } from "react-router-dom";
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
import {
  HtmlTable,
  Td,
  Th,
  Tr,
  Option,
  Select,
  OrderedBySection,
  BottomSection,
  SearchForm,
  SearchInp,
  TopSection,
} from "../../styles/Table.styles";

import { Wrapper } from "../../globalStyles";
import { FaBan } from "react-icons/fa";
import OffCanvas from "../../components/OffCanvas/OffCanvas";
import Map from "../../components/Map/Map";
import { Marker } from "@react-google-maps/api";
import {
  Badge,
  ButtonDiv,
  ButtonLink,
  ProfileImg,
} from "../../styles/Essentials.styles";
import Dropdown from "../../components/Dropdown/Dropdown";
import { Wrap } from "../styles/dashboard/Request.styles";

export default function Favorites() {
  const location = useLocation()
  const history = useHistory()

  if(location.pathname === "/favorites" || location.pathname === "/favorites/") {
    history.push("/favorites/requests")
  }


  
  
  return (
    <>
      <NavWrap>
        <NavTab activeClassName="active" exact to="/favorites/requests/">
          Request
        </NavTab>
        <NavTab activeClassName="active" exact to="/favorites/donor-requests/">
          Donations
        </NavTab>
        <NavTab activeClassName="active" exact to="/favorites/profiles/">
          Profiles
        </NavTab>
      </NavWrap>

      <Route exact path="/favorites/requests/">
        <Requests />
      </Route>

      <Route exact path="/favorites/donor-requests/">
        <DonorRequests />
      </Route>

      <Route exact path="/favorites/profiles/">
        <Profiles />
      </Route>
    </>
  );
}

const Requests = () => {
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const report = () => {
    // call api to report this request
    console.log("report request");
  };
  const [dropDownOption, setDropDownOption] = useState([
    { name: "Report", icon: FaBan, onClick: report },
  ]);
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

  const showMoreDetails = (id) => {
    // call the apis
    setShowRequestDetails(true);
    // setDetails({});
  };
  const onCanvasExit = () => {};

  return (
    <>
      <Wrap column>
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
              <Th>Name</Th>
              <Th>Time</Th>
              <Th>Blood Group</Th>
              <Th>Number</Th>
              <Th>Request Time</Th>
            </Tr>

            <Tr onClick={(e) => showMoreDetails(90)}>
              <Td>1</Td>
              <Td>Jimam TAmimi</Td>
              <Td>2 april 2021 4:30 pm </Td>
              <Td>A+</Td>
              <Td>01827485748</Td>
              <Td>2 april 2021 4:30 pm </Td>
            </Tr>
          </HtmlTable>
        </BottomSection>
        <OffCanvas
          onCanvasExit={onCanvasExit}
          setShow={setShowRequestDetails}
          show={showRequestDetails}
        >
          <>
            <DetailsMap>
              <Map
                coords={details.coords}
                isMarkerShown
                googleMapURL=" "
                loadingElement={
                  <div style={{ height: `350px`, width: "100%" }} />
                }
                containerElement={
                  <div style={{ height: `350px`, width: "100%" }} />
                }
                mapElement={<div style={{ height: `350px`, width: "100%" }} />}
                defaultZoom={14}
              >
                {<Marker position={details.cords} />}
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
        </OffCanvas>
      </Wrap>
    </>
  );
};

const DonorRequests = () => {
  const [showDonorRequest, setShowDonorRequest] = useState(false);
  const [donorRequestMoreDetails, setDonorRequestMoreDetails] = useState(null);

  const [dropDownOptions, setDropDownOptions] = useState([
    // { name: "Report", icon: FaBan, onClick: report },
  ]);

  const showMoreDetails = (id) => {
    // call the apis
    setShowDonorRequest(true);
    setDonorRequestMoreDetails({});
  };
  const onCanvasExit = () => {};

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
              <Th>Request Time</Th>
            </Tr>

            <Tr onClick={(e) => showMoreDetails(90)}>
              <Td>1</Td>
              <Td>
                {" "}
                <Link
                  style={{ display: "flex", alignItems: "center" }}
                  to="/user/23/"
                >
                  <ProfileImg size="45px" src={""} />{" "}
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
              <Td>2 april 2021 4:30 pm </Td>
            </Tr>
          </HtmlTable>
        </BottomSection>
        <OffCanvas
          onCanvasExit={onCanvasExit}
          setShow={setShowDonorRequest}
          show={showDonorRequest}
        >
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
                  <ProfileImg size="45px" src={""} />{" "}
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                  cumque molestiae asperiores alias maxime! Ea aspernatur sed
                  libero laudantium odit molestias tempore deleniti odio
                  perferendis modi? Magnam praesentium impedit quasi voluptates
                  molestiae ipsam quos cumque sed facere repellat sapiente sunt,
                  eligendi non animi iusto, quam consequuntur? Aliquid accusamus
                  quos nostrum.
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
        </OffCanvas>
      </Wrap>
    </>
  );
};

const Profiles = () => {
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const report = () => {
    // call api to report this request
    console.log("report request");
  };
  const [dropDownOption, setDropDownOption] = useState([
    { name: "Report", icon: FaBan, onClick: report },
  ]);
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

  const showMoreDetails = (id) => {
    // call the apis
    setShowRequestDetails(true);
    // setDetails({});
  };
  const onCanvasExit = () => {};

  return (
    <>
      <Wrap column>
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
              <Th>Name</Th>
              <Th>Time</Th>
              <Th>Blood Group</Th>
              <Th>Number</Th>
              <Th>Request Time</Th>
            </Tr>

            <Tr onClick={(e) => showMoreDetails(90)}>
              <Td>1</Td>
              <Td>Jimam TAmimi</Td>
              <Td>2 april 2021 4:30 pm </Td>
              <Td>A+</Td>
              <Td>01827485748</Td>
              <Td>2 april 2021 4:30 pm </Td>
            </Tr>
          </HtmlTable>
        </BottomSection>
        <OffCanvas
          onCanvasExit={onCanvasExit}
          setShow={setShowRequestDetails}
          show={showRequestDetails}
        >
          <>
            <DetailsMap>
              <Map
                coords={details.coords}
                isMarkerShown
                googleMapURL=" "
                loadingElement={
                  <div style={{ height: `350px`, width: "100%" }} />
                }
                containerElement={
                  <div style={{ height: `350px`, width: "100%" }} />
                }
                mapElement={<div style={{ height: `350px`, width: "100%" }} />}
                defaultZoom={14}
              >
                {<Marker position={details.cords} />}
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
        </OffCanvas>
      </Wrap>
    </>
  );
};
