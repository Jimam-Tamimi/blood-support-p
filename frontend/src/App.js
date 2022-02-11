import { Route, Redirect } from "react-router-dom";
import Layout from "./hoc/Layout";
import PrivateRoute from "./hoc/PrivateRoute";
import GuestRoute from "./hoc/GuestRoute";

import "./assets/css/transitions.css";

import Home from "./pages/dashboard/Home";
import MakeRequest from "./pages/dashboard/MakeRequest";
import Request from "./pages/dashboard/Request";

import Login from "./pages/account/Login";
import Signup from "./pages/account/Signup";
import ResetPassword from "./pages/account/ResetPassword";
import Activate from "./pages/account/Activate";
import HelpPeople from "./pages/dashboard/HelpPeople";
import DesignConfig from "./context/DesignConfig";
import Current from "./pages/dashboard/Current";
import AllRequests from "./pages/dashboard/AllRequests";
import Messages from "./pages/dashboard/Messages";
import Notifications from "./pages/dashboard/Notifications";
import Favorites from "./pages/dashboard/Favorites";
import Profile from "./pages/dashboard/Profile";
import { useDispatch, useSelector } from "react-redux";
import { authenticate, refreshToken } from "./redux/auth/actions";
import { useEffect, useState } from "react";
import VerifyEmail from "./pages/dashboard/VerifyEmail";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";
import styled from "styled-components";
import { getProfileDetails } from "./redux/profile/actions";

function App() {
  // hooks
  const dispatch = useDispatch();
  const progress = useSelector((state) => state.progress);
  const auth = useSelector((state) => state.auth);
  axios.interceptors.request.use(
    function (config) {
      if (JSON.parse(localStorage.getItem("auth"))?.isAuthenticated) {
        config.headers.authorization = `JWT ${
          JSON.parse(localStorage.getItem("auth"))?.access
        }`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log(error.response);
        if (JSON.parse(localStorage.getItem("auth"))?.isAuthenticated) {
          if (error?.response?.status === 401) {
            dispatch(refreshToken());
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);
  
  useEffect(() => {
    dispatch(authenticate());
  }, []);
  useEffect(() => {
    dispatch(getProfileDetails());
    
  }, [auth])
  
 

  return (
    <>
      <LoadingBar
        color={"var(--primary-color)"}
        progress={progress}
        height={3}
        onLoaderFinished={() => 0}
      />
      <WholeWrap>
        <DesignConfig>
          <Layout>
            <PrivateRoute>
              <Route path="/" component={Home} />
              <Route path="/make-request/" component={MakeRequest} />
              <Route path="/help-people/" component={HelpPeople} />
              <Route path="/requests/:slug/" component={Request} />
              <Route path="/current/" component={Current} />
              <Route path="/all-requests/" component={AllRequests} />
              <Route path="/notifications/" component={Notifications} />
              <Route path="/messages/" component={Messages} />
              <Route path="/favorites/" component={Favorites} /> 
              <Route exact path="/profile/" component={Profile} >
                <Redirect to={`/profile/${auth.user_id}/`} />
              </Route>
              <Route path="/profile/:id/" component={Profile} />
              <Route path="/email/verify/:id/" component={VerifyEmail} />
            </PrivateRoute>

            <GuestRoute>
              <Route path="/login/" component={Login} />
              <Route path="/signup/" component={Signup} />
              <Route path="/reset-password/" component={ResetPassword} />
              <Route path="/activate/:uid/:token/" component={Activate} />
            </GuestRoute>
          </Layout>
        </DesignConfig>
      </WholeWrap>
    </>
  );
}

export default App;

const WholeWrap = styled.div`
  * {
    transition: var(--main-transition);
  }
`;
