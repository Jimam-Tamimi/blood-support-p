import React, { useEffect, useState } from "react";
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
  OrderedBySection,
  BottomSection,
  SearchForm,
  SearchInp,
  TopSection,
} from "../../styles/Table.styles";
 
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
import { addBloodRequestToFavorites, addDonorRequestToFavorites, filterMyBloodRequests, filterMyFavBloodRequests, getAllBloodRequestByMe, getBloodRequestData, getProfileDetailsForUser, removeBloodRequestFromFavorites, removeDonorRequestFromFavorites } from "../../apiCalls";
import ReactSelect from "react-select";
import { bloodFilterOption, calcDistance, donorRequestFilterOption, getCurrentLocation, sortByDistance, sortById, sortByTime } from "../../helpers";
import { customStyles } from "../../styles/Form.styles";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import alert from "../../redux/alert/actions";
import useModal from "../../hooks/useModal";
import { setProgress } from "../../redux/progress/actions";

export default function Favorites() {
  const location = useLocation()
  const history = useHistory()
// useEffect(() => {
//   console.log(location)
//   if(location.pathname === "/favorites" || location.pathname === "/favorites/") {
//     history.push("/favorites/requests/", location.state)
//   }
// }, [])


  
  
  return (
    <>
      <NavWrap>
        <NavTab activeClassName="active" exact to="/favorites/requests/">
          Blood Requests
        </NavTab>
        <NavTab activeClassName="active" exact to="/favorites/donor-requests/">
          Donor Requests 
        </NavTab>
        <NavTab activeClassName="active" exact to="/favorites/users/">
          Users
        </NavTab>
      </NavWrap>

      <Route exact path="/favorites/requests/">
        <Requests />
      </Route>

      <Route exact path="/favorites/donor-requests/">
        <DonorRequests />
      </Route>

      <Route exact path="/favorites/users/">
        <Profiles />
      </Route>
    </>
  );
}

function Requests() {
  const [requestData, setRequestData] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // hooks

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const searchBloodRequest = async (e) => {
    const run = async () => {
      try {
        const res = await filterMyFavBloodRequests({ search: e.target.value });
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
      getMyFavBloodRequest()
      return history.push({
        pathname: location.pathname, 
      });
    } 
    try {
      const res = await filterMyFavBloodRequests({ status: e.value });
      if (res.status === 200) {
 
        
        console.log(res.data);
        setRequestData([...res.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMyFavBloodRequest = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/blood-request/favorites/`
      );   
      if(res.status === 200){
        setRequestData([...res.data]);
      }
    } catch (error) {
   
        if(error?.response?.data?.success === false) {
            dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
          dispatch(alert("Failed get your favorite blood request 😕", "danger"));
        }
      
    }
  }
  
  useEffect(async () => {
 
    getMyFavBloodRequest()
 
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
              <ReactSelect
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
              src={`${bloodRequestData?.userData?.profile_img}`}
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
 
function DonorRequests({ }) {
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
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}api/blood/donor-request/favorites/`, {params}
      );   
      if (res.status === 200) {
        setDonorRequestData(res.data);
        getCurrentLocation((crds) => {
          setCurrentLocation(crds);
        });
      }
    } catch (error) {
   
        if(error?.response?.data?.success === false) {
            dispatch(alert(error?.response?.data?.error, "danger"));
        } else {
          dispatch(alert("Failed get your favorite donor request 😕", "danger"));
        }
      
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
              <Th>Profile</Th>
              <Th>Name</Th>
              <Th
                onClick={(e) =>
                  sortByTime(donorRequestData)
                    .then((res) => setDonorRequestData([...res]))
                    .catch((err) => console.log(err))
                }>
                Time
              </Th>
 
            </Tr>
            {donorRequestData !== undefined &&
              donorRequestData?.map((donorRequest, index) => (
                <Tr
                  key={index}
                  onClick={(e) => showMoreDetails(donorRequest.id)}>
                  <Td>{donorRequest?.id}</Td>
                  <Td>
                    {" "}
                    <Link
                      style={{ display: "flex", alignItems: "center" }}
                      to={`/profile/${donorRequest?.user?.id}/`}>
                      <ProfileImg
                        size="45px"
                        src={`${donorRequest?.profile?.profile_img}`}
                      />{" "}
                      <p
                        className="profile-link-name"
                        style={{
                          position: "relative",
                          left: "15px",
                          fontWeight: "600",
                        }}>
                        {donorRequest?.profile?.name}
                      </p>
                    </Link>
                  </Td>
                  <Td>{donorRequest?.name}</Td>
                  <Td>
                    <Moment tz="Asia/Dhaka" format="DD/MM/YYYY hh:mm A">
                      {donorRequest?.date_time.replace("Z", "")}
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
  const auth = useSelector((state) => state.auth);
  

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
              src={`${donorRequestMoreDetails?.profile?.profile_img}`}
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
          <ButtonLink to={ donorRequestMoreDetails?.user?.id == auth.user_id?  `/requests/${donorRequestMoreDetails?.blood_request?.id}/donor-request/` : `/requests/${donorRequestMoreDetails?.blood_request?.id}/donors/?donor-request-id=${donorRequestMoreDetails?.id}` }>View</ButtonLink>
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
              {donorRequestMoreDetails?.status}
            </Badge>

          </div>
        </Action>
      </ActionDiv>
    </AllDetails>
  );
};

const Profiles = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [favUsers, setFavUsers] = useState([])
  
  const getMyFavUsers = async (params) => {
    try{
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/account/users/favorites/`, {params})
      if(res.status === 200){
        setFavUsers(res.data)
      }

    } catch(err){

    }
  }
 
  useEffect(() => {
    dispatch(setProgress(30))
    getMyFavUsers()
    dispatch(setProgress(100))
  }, [])
  

 
  return (
    <>
      <Wrap column>
        <TopSection>
          {/* <SearchForm>
            <SearchInp onKeyDown={e =>{ if (e?.key === "Enter") {e.preventDefault(); getMyFavUsers({search: e?.target?.value})}}} placeholder="Search..." />
          </SearchForm> */}
          <OrderedBySection>

          </OrderedBySection>
        </TopSection>
        <BottomSection>
          <HtmlTable>
            <Tr style={{ cursor: "default" }}>
              <Th>$</Th>
              <Th>Profile</Th>
              <Th>Blood Group</Th>
              <Th>Address</Th>
            </Tr>
        {
          favUsers.map((user, i) => ( 
            <Tr key={i} onClick={(e) => history.push(`/profile/${user?.user?.id}/`)}>
              <Td>{i+1}</Td>
              <Td style={{ display: "flex", alignItems: "center" }} >
                    {" "}
                      
                      <ProfileImg
                        size="45px"
                        src={user?.profile_img}
                      />{" "}
                      <p
                        className="profile-link-name"
                        style={{
                          position: "relative",
                          left: "15px",
                          fontWeight: "600",
                        }}>
                        {user?.name}
                      </p>
                  </Td>
              <Td>{user?.blood_group}</Td>
              <Td>{user?.address}</Td> 
            </Tr> 
          ))
        }
          </HtmlTable>
        </BottomSection>
 
      </Wrap>
    </>
  );
};
