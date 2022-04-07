import React, { useState, useEffect } from "react";

import { Link, Route } from "react-router-dom";

import OffCanvas from "../../components/OffCanvas/OffCanvas";

import {
  ProfileImg,
  ButtonDiv,
  Badge,
  Profile,
  ButtonLink,
  Button,
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
import { useDispatch } from "react-redux";
import axios from "axios";
import { calcDistance, donorRequestFilterOption, getCurrentLocation, sortByDistance, sortById, sortByTime } from "../../helpers";
import alert from "../../redux/alert/actions";
import { setProgress } from "../../redux/progress/actions";
import { addDonorRequestToFavorites, getAllDonorRequestByMe, removeDonorRequestFromFavorites, searchDonorRequestsForBloodRequest } from "../../apiCalls";
import Moment from "react-moment";
import useModal from "../../hooks/useModal";
import ReportForm from "../../components/ReportForm";
import { FaBan } from "react-icons/fa";
import { customStyles } from "../../styles/Form.styles";
import ReactSelect from "react-select";
 
export default function DonorRequests({ }) {
  // hooks
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [donorRequestData, setDonorRequestData] = useState([]);
  const [showDonorRequest, setShowDonorRequest] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [donorRequestMoreDetails, setDonorRequestMoreDetails] = useState(null);

  const getDonorRequests = async (params = {}) => {
    try {
      const res = await getAllDonorRequestByMe(params)
      if (res.status === 200) {
        setDonorRequestData(res.data);
        getCurrentLocation((crds) => {
          setCurrentLocation(crds);
        });
      }
    } catch (error) {
      dispatch(alert("Failed to fetch donor requests", "danger"));
    }
  };

  useEffect(async () => {
    await getDonorRequests();
  }, []);

  const showMoreDetails = (id) => {
    setShowDonorRequest(true);
    donorRequestData.map(
      (donorRequest) =>
        donorRequest.id === id && setDonorRequestMoreDetails(donorRequest)
    );
  };
  const onCanvasExit = () => {
    setTimeout(() => {
      setDonorRequestMoreDetails(null);
      setShowDonorRequest(false);
    }, 450);
  };

  const searchDonReq = (e) => {
    const run = () => {
      // getDonorRequests({ search : e?.target?.value?.trim() })
      console.log('first')
      let params = Object.fromEntries(new URLSearchParams(location.search))
      history.push(location.pathname + "?" + new URLSearchParams({ ...params, search: e?.target?.value }).toString())
    };


    if (e.key === "Enter") {
      e.preventDefault();
      run();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const status = params.get("status");
    const dataParams = {}
    if (search) {
      dataParams.search = search;
    }
    if (status) {
      dataParams.status = status
    }

    getDonorRequests(dataParams);

  }, [location])



  return (
    <>
      <Wrap>
        <TopSection>
          <SearchForm>
            <SearchInp defaultValue={new URLSearchParams(location.search).get('search')} onKeyDown={searchDonReq} placeholder="Search..." />
          </SearchForm>
          <OrderedBySection>
            <div className="filter-div">
              <ReactSelect
                className="basic-single"
                classNamePrefix="select"
                defaultValue={donorRequestFilterOption[0]}
                disabledValue={donorRequestFilterOption[0]}
                isDisabled={false}
                isLoading={false}
                isClearable={false}
                isRtl={false}
                isSearchable={true}
                name="donor-request-filter"
                options={donorRequestFilterOption}
                styles={customStyles}
                onChange={e => history.push(location.pathname + "?" + new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(location.search)), status: e?.value }).toString())}
              />
            </div>
          </OrderedBySection>
        </TopSection>
        <BottomSection>
          <HtmlTable>
            <Tr style={{ cursor: "default" }}>
              <Th
                onClick={(e) =>
                  sortById(donorRequestData)
                    .then((res) => setDonorRequestData([...res]))
                    .catch((err) => console.log(err))
                }>
                $
              </Th>
              <Th>Name</Th>
              <Th
                onClick={(e) =>
                  sortByTime(donorRequestData)
                    .then((res) => setDonorRequestData([...res]))
                    .catch((err) => console.log(err))
                }>
                Time
              </Th>
              <Th
                onClick={(e) =>
                  sortByDistance(
                    donorRequestData[0].blood_request.location,
                    donorRequestData
                  )
                    .then((res) => setDonorRequestData([...res]))
                    .catch((err) => console.log(err))
                }>
                Requested At
              </Th>
            </Tr>
            {donorRequestData !== undefined &&
              donorRequestData?.map((donorRequest, index) => (
                <Tr
                  key={index}
                  onClick={(e) => showMoreDetails(donorRequest.id)}>
                  <Td>{donorRequest?.id}</Td>

                  <Td>{donorRequest?.name}</Td>
                  <Td>
                    <Moment tz="Asia/Dhaka" format="DD/MM/YYYY hh:mm A">
                      {donorRequest?.date_time.replace("Z", "")}
                    </Moment>
                  </Td>
                  <Td>
                    <Moment tz="Asia/Dhaka" format="DD/MM/YYYY hh:mm A">
                      {donorRequest?.timestamp.replace("Z", "")}
                    </Moment>
                  </Td>

                  <div className="table-row-badge">
                    <Badge sm> {donorRequest?.status} </Badge>

                    <Badge transparent sm>
                      <Moment fromNow>{donorRequest.timestamp}</Moment>
                    </Badge>
                  </div>
                </Tr>
              ))}
          </HtmlTable>
        </BottomSection>

        <OffCanvas
          onCanvasExit={onCanvasExit}
          setShow={setShowDonorRequest}
          show={showDonorRequest}>
          {donorRequestMoreDetails && showDonorRequest ? (
            <DonorRequestMoreDetails
              setDonorRequestMoreDetails={setDonorRequestMoreDetails}
              donorRequestMoreDetails={donorRequestMoreDetails}
              setShowDonorRequest={setShowDonorRequest}
            />
          ) : (
            ""
          )}
        </OffCanvas>
      </Wrap>
    </>
  );
};

const DonorRequestMoreDetails = ({
  donorRequestMoreDetails,
  setDonorRequestMoreDetails,
  setShowDonorRequest,
}) => {
  // hooks

  const dispatch = useDispatch();
  const modalController = useModal();

  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });





  useEffect(() => {
    getCurrentLocation((crds) => {
      setCurrentLocation(crds);
    });
  }, []);



  const dropDownOptions = [
    !donorRequestMoreDetails?.is_favorite ? { name: "Add To Favorites", icon: <FaBan />, onClick: () => addDonorRequestToFavorites(donorRequestMoreDetails?.id).then(res => setDonorRequestMoreDetails({ ...donorRequestMoreDetails, is_favorite: true })).catch() } : { name: "Remove From Favorites", icon: <FaBan />, onClick: () => removeDonorRequestFromFavorites(donorRequestMoreDetails?.id).then(res => setDonorRequestMoreDetails({ ...donorRequestMoreDetails, is_favorite: false })).catch() },
  ];


  return (
    <AllDetails>
      <DetailsDiv>
        <DetailHeader>Requested By: </DetailHeader>
        <Detail>
          <Link
            style={{ display: "flex", alignItems: "center" }}
            to={`/profile/${donorRequestMoreDetails?.user?.id}/`}>
            <ProfileImg
              size="45px"
              src={`${process.env.REACT_APP_MEDIA_URL}${donorRequestMoreDetails?.profile?.profile_img}`}
            />{" "}
            <p
              className="profile-link-name"
              style={{
                position: "relative",
                left: "15px",
                fontWeight: "600",
              }}>
              {donorRequestMoreDetails?.profile?.name}
            </p>{" "}
          </Link>
        </Detail>

        <DetailHeader>Informations: </DetailHeader>
        <Detail>
          <DetailField>Name: </DetailField>
          <DetailFieldValue>{donorRequestMoreDetails?.name}</DetailFieldValue>
        </Detail>
        <Detail>
          <DetailField>Time: </DetailField>
          <DetailFieldValue>
            <Moment tz="Asia/Dhaka" format="DD/MM/YYYY hh:mm A">
              {donorRequestMoreDetails?.date_time.replace("Z", "")}
            </Moment>
          </DetailFieldValue>
        </Detail>
        <Detail>
          <DetailField>Distance: </DetailField>
          <DetailFieldValue>
            {calcDistance(
              donorRequestMoreDetails?.location,
              donorRequestMoreDetails.blood_request.location
            )}{" "}
            KM
          </DetailFieldValue>
        </Detail>

        <DetailHeader>Contacts: </DetailHeader>
        <Detail>
          <DetailField>Email: </DetailField>
          <DetailFieldValue>{donorRequestMoreDetails?.email}</DetailFieldValue>
        </Detail>
        <Detail>
          <DetailField>Number: </DetailField>
          <DetailFieldValue>{donorRequestMoreDetails?.number}</DetailFieldValue>
        </Detail>
        <Detail>
          <DetailField>Additional Number: </DetailField>
          <DetailFieldValue>
            {donorRequestMoreDetails?.add_number}
          </DetailFieldValue>
        </Detail>

        <DetailHeader>Description: </DetailHeader>
        <Detail>
          <DetailFieldValue>
            {donorRequestMoreDetails?.description}
          </DetailFieldValue>
        </Detail>
        <DetailHeader>Actions: </DetailHeader>
        <ButtonDiv>
          <ButtonLink to={`/requests/${donorRequestMoreDetails?.blood_request?.id}/donor-request/`}>View</ButtonLink>
        </ButtonDiv>


      </DetailsDiv>

      <ActionDiv>
        <Action>
          <Dropdown options={dropDownOptions} />
        </Action>
        <Action>
          <Badge
            info
            style={{
              position: "absolute",
              width: "max-content",
              right: "6px",
              top: "20px",
            }}>
            {donorRequestMoreDetails?.status}
          </Badge>
        </Action>
        <Action>
          <div className="action-badge">
            <Badge
              info
              style={{
                width: "max-content",
              }}>
              {donorRequestMoreDetails?.status}
            </Badge>

          </div>
        </Action>
      </ActionDiv>
    </AllDetails>
  );
};