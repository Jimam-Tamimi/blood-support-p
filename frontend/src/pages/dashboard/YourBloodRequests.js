import React, { useState, useEffect } from "react";
import Select from "react-select";

import { Link, Route } from "react-router-dom";

import OffCanvas from "../../components/OffCanvas/OffCanvas";

import {
  ProfileImg,
  ButtonDiv,
  Badge,
  Button,
  Profile,
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
} from "../../styles/Details.styles";
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
import Dropdown from "../../components/Dropdown/Dropdown";

import Map from "../../components/Map/Map";

import { NavWrap, NavTab } from "../../styles/Nav.styles";
import { Wrap } from "../styles/dashboard/Request.styles";

import { useHistory, useLocation } from "react-router";
import { Marker } from "@react-google-maps/api";
import {
  bloodFilterOption,
  calcDistance,
  donorRequestFilterOption,
  sortByDistance,
  sortById,
  sortByTime,
} from "../../helpers";
import { customStyles } from "../../styles/Form.styles";
import {
  addBloodRequestToFavorites,
  addDonorRequestToFavorites,
  filterMyBloodRequests,
  getAllBloodRequestByMe,
  getBloodRequestData,
  getProfileDetailsForUser,
  removeBloodRequestFromFavorites,
  removeDonorRequestFromFavorites,
} from "../../apiCalls";
import { FaBan } from "react-icons/fa";
import ReportForm from "../../components/ReportForm";
import useModal from "../../hooks/useModal";
import { useDispatch } from "react-redux";
import Moment from "react-moment";

export default function YourBloodRequests() {
  const [requestData, setRequestData] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // hooks

  const location = useLocation();
  const history = useHistory();

  const searchBloodRequest = async (e) => {
    const run = async () => {
      try {
        const res = await filterMyBloodRequests({ search: e.target.value });
        if (res.status === 200) {
 
          setRequestData([...res.data]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (e.key === "Enter") {
      e.preventDefault();
    }
    if (e.keyCode === 13) {
      e.preventDefault();
      run();
    }
  };

  const filterBloodRequest = async (e) => {
    if(e.value === "All"){
      getMyBloodRequest()
      return history.push({
        pathname: location.pathname, 
      });
    } 
    try {
      const res = await filterMyBloodRequests({ status: e.value });
      if (res.status === 200) {
 
        
        console.log(res.data);
        setRequestData([...res.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMyBloodRequest = async () => {
    try {
      const res = await getAllBloodRequestByMe();
      if (res.status === 200) {
        setRequestData(res.data);
      }
    } catch (error) {}
  }
  
  useEffect(async () => {
 
      getMyBloodRequest()
 
  }, []);

  return (
    <>
      <Wrap>
        <TopSection>
          <SearchForm>
            <SearchInp
              onChange={searchBloodRequest}
              onKeyDown={searchBloodRequest}
              placeholder="Search..."
            />
          </SearchForm>
          <OrderedBySection>
            <div className="filter-div">
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={bloodFilterOption[0]}
                disabledValue={bloodFilterOption[0]}
                isDisabled={false}
                isLoading={false}
                isClearable={false}
                isRtl={false}
                isSearchable={true}
                name="donor-request-filter"
                options={bloodFilterOption}
                styles={customStyles}
                onChange={filterBloodRequest}
              />
            </div>
          </OrderedBySection>
        </TopSection>
        <BottomSection>
          <HtmlTable>
            <Tr style={{ cursor: "default" }}>
              <Th
                onClick={(e) =>
                  sortById(requestData)
                    .then((res) => setRequestData([...res]))
                    .catch((err) => console.log(err))
                }>
                $
              </Th>
              <Th>Name</Th>
              <Th
                onClick={(e) =>
                  sortByTime(requestData)
                    .then((res) => setRequestData([...res]))
                    .catch((err) => console.log(err))
                }>
                Time
              </Th>
              <Th>Blood Group</Th>
              <Th>Email</Th>
              {/* {showEmail ? <Th>Email</Th> : ""} */}
            </Tr>
            {requestData !== undefined &&
              requestData?.map((bloodRequest, index) => (
                <Tr
                  key={index}
                  onClick={(e) =>
                    setTimeout(() => {
                      setShowMoreDetails(bloodRequest.id);
                    }, 1)
                  }>
                  <Td>{index + 1}</Td>
                  <Td>{bloodRequest?.name}</Td>

                  <Td>
                    <Moment tz="Asia/Dhaka" format="DD/MM/YYYY hh:mm A">
                      {bloodRequest?.date_time.replace("Z", "")}
                    </Moment>
                  </Td>
                  <Td>{bloodRequest?.blood_group}</Td>
                  <Td>{bloodRequest?.email}</Td>

                  <div className="table-row-badge">
                    <Badge sm> {bloodRequest?.status} </Badge>

                    <Badge transparent sm>
                      <Moment fromNow>{bloodRequest?.timestamp}</Moment>
                    </Badge>
                  </div>
                </Tr>
              ))}
          </HtmlTable>
        </BottomSection>

        <OffCanvas
          // onCanvasExit={onCanvasExit}
          setShow={setShowMoreDetails}
          unMountOnHide
          show={showMoreDetails != false}>
          <RequestDetails
            requestData={requestData}
            showMoreDetails={showMoreDetails}
          />
        </OffCanvas>
      </Wrap>
    </>
  );
}

const RequestDetails = ({ showMoreDetails, requestData }) => {
  const [bloodRequestData, setBloodRequestData] = useState({});

  //  hooks
  const dispatch = useDispatch();

  const dropDownOptions = [
    !bloodRequestData?.is_favorite ? { name: "Add To Favorites", icon: <FaBan />, onClick: () => addBloodRequestToFavorites(bloodRequestData?.id).then(res => setBloodRequestData({...bloodRequestData, is_favorite: true})).catch() } : { name: "Remove From Favorites", icon: <FaBan />, onClick: () => removeBloodRequestFromFavorites(bloodRequestData?.id).then(res => setBloodRequestData({...bloodRequestData, is_favorite: false})).catch() },
  ];


  // functions
  // get blood request data using id

  useEffect(async () => {
    console.log({ showMoreDetails });
    if (showMoreDetails) {
      const res = await getBloodRequestData(showMoreDetails);
      console.log({ res });
      if (res.status === 200) {
        const userDataRes = await getProfileDetailsForUser(res?.data?.user?.id);
        setBloodRequestData({ ...res.data, userData: userDataRes.data });
      }
    }
  }, [showMoreDetails]);

  return (
    <>
      <DetailsMap>
        <Map
          coords={bloodRequestData?.location}
          isMarkerShown
          googleMapURL=" "
          loadingElement={<div style={{ height: `350px`, width: "100%" }} />}
          containerElement={<div style={{ height: `350px`, width: "100%" }} />}
          mapElement={<div style={{ height: `350px`, width: "100%" }} />}
          defaultZoom={14}>
          {<Marker position={bloodRequestData?.location} />}
        </Map>
      </DetailsMap>
      <AllDetails>
        <DetailsDiv>
          <DetailHeader>Posted By: </DetailHeader>
          <Profile to={`/profile/${bloodRequestData?.userData?.user?.id}/`}>
            <ProfileImg
              size="55px"
              style={{ marginRight: "10px" }}
              src={`${process.env.REACT_APP_MEDIA_URL}${bloodRequestData?.userData?.profile_img}`}
            />
            <DetailFieldValue className="profile-link-name">
              {bloodRequestData?.userData?.name}
            </DetailFieldValue>
          </Profile>
          <DetailHeader>Informations: </DetailHeader>
          <Detail>
            <DetailField>Name: </DetailField>
            <DetailFieldValue>{bloodRequestData?.name}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Time: </DetailField>
            <DetailFieldValue>{bloodRequestData?.date_time}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Blood Group: </DetailField>
            <DetailFieldValue>{bloodRequestData?.blood_group}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Number: </DetailField>
            <DetailFieldValue>{bloodRequestData?.number}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Additional Number: </DetailField>
            <DetailFieldValue>{bloodRequestData?.number}</DetailFieldValue>
          </Detail>
          <Detail>
            <DetailField>Email: </DetailField>
            <DetailFieldValue>{bloodRequestData?.email}</DetailFieldValue>
          </Detail>

          <DetailHeader>Description: </DetailHeader>
          <Detail>
            <DetailFieldValue>{bloodRequestData?.description}</DetailFieldValue>
          </Detail>
          <ButtonDiv>
            <ButtonLink
              to={`/requests/${bloodRequestData.id}/`}
              style={{ padding: "10px 15px", margin: "0" }}>
              View
            </ButtonLink>
          </ButtonDiv>
        </DetailsDiv>
        <ActionDiv>
          <Action>
            <Dropdown options={dropDownOptions} />
          </Action>
          <Action>
                <div className="action-badge">
                  <Badge
                    info
                    style={{
                      width: "max-content",
                    }}>
                    {bloodRequestData?.status}
                  </Badge>
                  <Badge
                    info
                    style={{
                      width: "max-content",
                    }}>
                    {bloodRequestData?.donor_request_got} Request Got
                  </Badge>
                </div>
              </Action>
        </ActionDiv>
      </AllDetails>
    </>
  );
};
 