import React, { useEffect, useState, useRef } from "react";
import {
  BloodRequestBox,
  RequestAddress,
  RequestDetails,
  Field,
  Value,
  Wrap,
  Actions,
  NumOfReq,
} from "./BloodRequest.styles";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaBan } from "react-icons/fa";
import Map from "../Map/Map";
import {
  Button,
  Badge,
  ButtonLink,
  Profile,
  ProfileImg,
} from "../../styles/Essentials.styles";
import { Marker } from "react-google-maps";
import Dropdown from "../Dropdown/Dropdown";
import axios from "axios";

import Moment from "react-moment";
import { getProfileDetailsForUser } from "../../apiCalls";

export default function BloodRequest({
  setShowRequestDetails,
  setBloodRequestId,
  requestData,
}) {
  const report = () => {
    // call api to report this request
    console.log("report request");
  };

  const [dropDownOption, setDropDownOption] = useState([
    { name: "Report", icon: FaBan, onClick: report },
  ]);

  // get user data
  const [requestorData, setRequestorData] = useState(null);

  useEffect(async () => {
    try {
      const res = await getProfileDetailsForUser(requestData?.user?.id);
      if (res.status === 200) {
        setRequestorData(res.data);
      }
    } catch (error) {}
  }, []);

  return (
    <>
      <BloodRequestBox>
        <RequestAddress>
          <Map
            coords={requestData?.location}
            isMarkerShown
            googleMapURL=" "
            loadingElement={<div style={{ height: `100%`, width: "100%" }} />}
            containerElement={<div style={{ height: `100%`, width: "100%" }} />}
            mapElement={<div style={{ height: `100%`, width: "100%" }} />}
            defaultZoom={15}>
            {<Marker position={requestData?.location} />}
          </Map>
        </RequestAddress>
        <RequestDetails>
          <NumOfReq style={{ width: "100%" }}>
            <Dropdown options={dropDownOption} absolute />
            {/* <IconDiv onClick={e => setShowDropdown(!showDropdown)} style={{margin: "unset", position: "absolute", top: "-4px", right: "-16px"}} scaleOnHover  width="30px" fontSize="20px" height="30px">
                            <BsThreeDotsVertical/>
                        </IconDiv>
                        <DropdownMenu onClick={e => showDropdown?setShowDropdown(false): ''}  showDropdown={showDropdown} >
                            <DropdownLink >
                                <LinkIcon>
                                    <FaBan/>
                                </LinkIcon>
                                <LinkText>
                                    Report
                                </LinkText>
                            </DropdownLink>
                            <DropdownLink >
                                <LinkIcon>
                                    <FaBan/>
                                </LinkIcon>
                                <LinkText>
                                    Save
                                </LinkText>
                            </DropdownLink>
                        </DropdownMenu> */}
          </NumOfReq>

          <Field>
            <Profile
              to={`/profile/${requestData?.user?.id}/`}
              style={{ marginLeft: "0" }}>
              <ProfileImg
                size="3.5rem"
                src={`${process.env.REACT_APP_MEDIA_URL}${requestorData?.profile_img}`}
              />
              <b className="profile-link-name" style={{ marginLeft: "15px" }}>
                {requestData.name}
              </b>
            </Profile>
          </Field>
          <Field>
            Time:{" "}
            <Value>
              {" "}
              <Moment format="DD/MM/YYYY hh:MM A">
                {requestData.date_time}
              </Moment>
            </Value>
          </Field>
          <Field>
            Blood Group: <Value>{requestData.blood_group}</Value>
          </Field>
          <Field>
            Description: <Value>{requestData.description}</Value>
          </Field>
          <Wrap>
            <Actions>
              <Button
                onClick={(e) => {
                  setShowRequestDetails(true);
                  setBloodRequestId(requestData.id);
                }}
                info
                style={{ padding: "10px 15px", margin: "0" }}
                sm>
                See More
              </Button>
              <ButtonLink
                to={`/requests/${requestData?.id}/`}
                success
                style={{ padding: "10px 15px", marginLeft: "10px" }}
                sm>
                View
              </ButtonLink>
            </Actions>

            <NumOfReq>
              <Badge
                info
                sm
                style={{
                  position: "absolute",
                  width: "max-content",
                  right: "-3px",
                  top: "-28px",
                }}>
                10
              </Badge>
              <Badge
                style={{
                  background: "transparent",
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "var(--secondery-text-color)",
                  transition: "var(--main-transition) !important",
                  position: "absolute",
                  width: "max-content",
                  right: "-8.4px",
                  bottom: "-21px",
                }}
                sm>
                <Moment fromNow>{requestData.timestamp}</Moment>
              </Badge>
            </NumOfReq>
          </Wrap>
        </RequestDetails>
      </BloodRequestBox>
    </>
  );
}
