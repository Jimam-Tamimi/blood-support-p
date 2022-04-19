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
import { addBloodRequestToFavorites, deleteBloodRequest, getProfileDetailsForUser, removeBloodRequestFromFavorites } from "../../apiCalls";
import useModal from "../../hooks/useModal";
import { Form, InputDiv, Label, TextArea } from "../../styles/Form.styles";
import ReportForm from "../ReportForm";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function BloodRequest({
  setShowRequestDetails,
  setBloodRequestId,
  requestDataProp,
  
}) {
  const [requestData, setRequestData] = useState(requestDataProp)

  
  
  // hooks
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const modalController = useModal()
  const report = () => {
    // call api to report this request
    modalController.showModal(<ReportForm formId='blood-request-report' data={{blood_request_id: requestData?.id}} onSuccess={ () => {
      setRequestData({...requestData, is_reported: true}) }} />)

  };
  const deleteThisBloodRequest = () => {
    if(window.confirm('Are you sure you want to delete this request?')) {
      deleteBloodRequest(requestData?.id).then(() => {
        history.push('/');
        dispatch(alert('Request deleted successfully!', 'success'));
      }).catch(() => {});
    }
  };

  const dropDownOption = [
    auth?.user_id == requestData?.user?.id ? { name: "Delete", icon: <FaBan />, onClick: deleteThisBloodRequest } : { name:  requestData?.is_reported? "Reported" : "Report", icon: <FaBan />, onClick: !requestData?.is_reported? report : () => '' , disabled: requestData?.is_reported },
    !requestData?.is_favorite ? { name: "Add To Favorites", icon: <FaBan />, onClick: () => addBloodRequestToFavorites(requestData?.id).then(res => setRequestData({...requestData, is_favorite: true})).catch() } : { name: "Remove From Favorites", icon: <FaBan />, onClick: () => removeBloodRequestFromFavorites(requestData?.id).then(res => setRequestData({...requestData, is_favorite: false})).catch() },
  ]

  
  useEffect(() => {
    setRequestData(requestDataProp)
  }, [requestDataProp])
  
  useEffect(() => {
    console.log({dropDownOption})
  }, [requestDataProp])
  
  
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
          <NumOfReq style={{ width: "100%", }}>
            <Dropdown  options={dropDownOption} absolute />
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
                {requestData?.donor_request_got}
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
