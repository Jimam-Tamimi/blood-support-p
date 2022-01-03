import { Route,Redirect } from "react-router-dom";
import Layout from "./hoc/Layout";
import PrivateRoute from "./hoc/PrivateRoute"
import GuestRoute from "./hoc/GuestRoute"

import "./assets/css/transitions.css"

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
import { useSelector } from "react-redux";


function App() {
  
  const auth = useSelector(state => state.auth)
  // console.log(auth)
  
  
  return (
    <>
    <DesignConfig>

      <Layout>
        <PrivateRoute>
          <Route path='/' component={Home} />
          <Route path='/make-request/' component={MakeRequest} />
          <Route path='/help-people/' component={HelpPeople} />
          <Route path='/requests/:id/' component={Request} />
          <Route path='/current/' component={Current} />
          <Route path='/all-requests/' component={AllRequests} />
          <Route path='/notifications/' component={Notifications} />
          <Route path='/messages/' component={Messages} />
          <Route path='/favorites/' component={Favorites} />
          <Route exact path='/profile/'   component={Profile} >
            <Redirect to='/profile/43434/' />
          </Route>
          <Route path='/profile/:id/'  component={Profile} />
        </PrivateRoute>


        <GuestRoute >
          <Route path='/login/' component={Login} />
          <Route path='/signup/' component={Signup} />
          <Route path='/reset-password/' component={ResetPassword} />
          <Route path='/activate/:uid/:token/' component={Activate} />

        </GuestRoute>


      </Layout>
    </DesignConfig>
    </>
  );
}

export default App;


