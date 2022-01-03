import { Marker } from "@react-google-maps/api";
import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";


import Map from "../../components/Map/Map";


import {
  ProfileImg,
  ButtonDiv,
  Badge,
  Button,
  Profile as ProfileStyle,
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




export default function Profile({match}) {
  const history = useHistory()
  const location = useLocation()
  useEffect(() => {
    if(location.pathname === `/profile/${match.params.id}/` || location.pathname === `/profile/${match.params.id}`) {
      history.push(`/profile/${match.params.id}/details/`)
    }
  }, [location]) 
  
  return (
    <>
      <DetailsMap>
        <Map
          coords={{ lat: 24.0077202, lng: 89.2429551 }}
          isMarkerShown
          googleMapURL=" "
          loadingElement={<div style={{ height: `350px`, width: "100%" }} />}
          containerElement={<div style={{ height: `350px`, width: "100%" }} />}
          mapElement={<div style={{ height: `350px`, width: "100%" }} />}
          defaultZoom={14}
        >
          {<Marker position={{ lat: 24.0077202, lng: 89.2429551 }} />}
        </Map>
      </DetailsMap>
      <ProfileImgDiv>
        <ProfileImg
          src={prof}
          size="130px"
          style={{ position: "absolute", bottom: "15px", left: "15px" }}
        />
      </ProfileImgDiv>

      <NavWrap>
        <NavTab activeClassName="active" exact to={`/profile/${match.params.id}/details/`}>
          Details
        </NavTab>
        <NavTab activeClassName="active" to={`/profile/${match.params.id}/review/`}>
          Review
        </NavTab>
      </NavWrap>

      <Route exact path="/profile/:id/details/" component={Details}/>

      <Route path="/profile/:id/review/" component={Review}/>
    </>
  );
}

function Details() {
  const report = () => {
    // call api to report this request
    console.log("report request");
  };

  const [dropDownOption, setDropDownOption] = useState([
    { name: "Report", icon: FaBan, onClick: report },
  ]);

  return (
    <>
      <AllDetails>
        <DetailsDiv>
          <DetailHeader>Details: </DetailHeader>
          <Detail>
            <DetailField>Name: </DetailField>
            <DetailFieldValue>Jimam Tamimi</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Blood Group: </DetailField>
            <DetailFieldValue>A+</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Email: </DetailField>
            <DetailFieldValue>jimamtamimi12@gmail.com</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Address: </DetailField>
            <DetailFieldValue>pabna sadar, pabna</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Number: </DetailField>
            <DetailFieldValue>01347584758</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Additional Number: </DetailField>
            <DetailFieldValue>01347585657</DetailFieldValue>
          </Detail>

          <ButtonDiv></ButtonDiv>
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
              New Member
            </Badge>
          </Action>
        </ActionDiv>
      </AllDetails>
    </>
  );
}

function Review({match}) {
  const history = useHistory()
  const location = useLocation()
  useEffect(() => {
    if(location.pathname === `/profile/${match.params.id}/review/` || location.pathname === `/profile/${match.params.id}/review`) {
      history.push(`/profile/${match.params.id}/review/as-requestor/`)
    }
  }, [location]) 
  
  return (
    <>
      <NavWrap>
        <NavTab
          activeClassName="active"
          exact
          to={`/profile/${match.params.id}/review/as-requestor/`}
        >
          Review As Requestor
        </NavTab>
        <NavTab
          activeClassName="active"
          exact
          to={`/profile/${match.params.id}/review/as-donor/`}
        >
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
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    setReviews([{}, {}, {}, {}, {}, {}, {}, {}, {}, ])
  }, [])
  
  
  
  
  const firstExample = {
    size: 30,
    value: 2.5,
    edit: false,
    activeColor: "var(--primary-color)",
  };
  
  return (
    <>
      <ReviewWrap>
        {
          reviews?.map((review, index) => (
            <>
              <ReviewDiv to="/requests/545/">
                <ProfileImg size="100px" src={prof} />
                <ReviewContent>
                  <div style={{display:"flex", alignItems:'center'}}> 
                    <h3 style={{ color: "var(--secendory-text-color)" }}>
                      Jimam Tamimi
                    </h3>
                    <div style={{position:"relative", bottom: "2px", left: "18px" }}>
                      <ReactStars {...firstExample} />
                    </div>

                  </div>
                  <p style={{ fontSize: "14px", color:'var(--secendory-text-color)' }}>
                    aa quick brown fox jumped over the lazy doga quick brown fox
                    jumped over the lazy doga quick brown fox jumped over the lazy
                    doga quick brown fox jumped over the lazy doga quick brown fox
                    jumped over the lazy doga quick brown fox jumped over the lazy
                    doga quick brown fox jumped over the lazy dog quick brown fox
                    jumped over the lazy dog
                  </p>
                </ReviewContent>
                <Badge sm style={{position: "absolute", bottom: '13px', right: "18px"}} >3 days ago</Badge>
              </ReviewDiv>
              </>

          ))
        }

      </ReviewWrap>
    </>
  );
}

function DonorReview() {
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    setReviews([{}, {}, {}, {}, {}, {}, {}, {}, {}, ])
  }, [])
  
  
  
  
  const firstExample = {
    size: 30,
    value: 2.5,
    edit: false,
    activeColor: "var(--primary-color)",
  };
  
  return (
    <>
      <ReviewWrap>
        {
          reviews?.map((review, index) => (
            <>
              <ReviewDiv to="/requests/545/">
                <ProfileImg size="100px" src={prof} />
                <ReviewContent>
                  <div style={{display:"flex", alignItems:'center'}}> 
                    <h3 style={{ color: "var(--secendory-text-color)" }}>
                      Jimam Tamimi
                    </h3>
                    <div style={{position:"relative", bottom: "2px", left: "18px" }}>
                      <ReactStars {...firstExample} />
                    </div>

                  </div>
                  <p style={{ fontSize: "14px", color:'var(--secendory-text-color)' }}>
                    aa quick brown fox jumped over the lazy doga quick brown fox
                    jumped over the lazy doga quick brown fox jumped over the lazy
                    doga quick brown fox jumped over the lazy doga quick brown fox
                    jumped over the lazy doga quick brown fox jumped over the lazy
                    doga quick brown fox jumped over the lazy dog quick brown fox
                    jumped over the lazy dog
                  </p>
                </ReviewContent>
                <Badge sm style={{position: "absolute", bottom: '13px', right: "18px"}} >3 days ago</Badge>
              </ReviewDiv>
              </>

          ))
        }

      </ReviewWrap>
    </>
  );
}
