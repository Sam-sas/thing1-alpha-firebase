import React from "react";

//navigation
import Navigation from "./navigation/Navigation";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//authorization
import { AuthProvider } from "../contexts/AuthContext";
import UpdateProfile from "./authForms/UpdateProfile";
import Signup from "./authForms/Signup";
import ExpertValidationForm from "./authForms/ExpertValidationForm"
import Login from "./authForms/Login";
import ForgotPassword from "./authForms/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
//pages
import Dashboard from "./Dashboard";
import SearchListing from '../pages/SearchListing'
import Account from '../pages/Account';
import ExpertProfilePage from "./ExpertProfilePage";
import About from '../pages/About';
import Contact from '../pages/Contact';
import CalendarPage from '../pages/CalendarPage';
import LandingPage from '../pages/LandingPage';
// import ViewProjects from '../pages/ViewProjects';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />  
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <PrivateRoute path="/sign-up-validation-form" component={ExpertValidationForm} />
          <Route path="/forgot-password" component={ForgotPassword} />
          {/* To be moved */}
          <Route path='/search-listing' exact component={SearchListing} />
          <Route path='/account-page' exact component={Account} />
          <Route path='/profile-page' component={ExpertProfilePage} />
          <Route path='/about-page' exact component={About} />
          <Route path='/contact-page' component={Contact} />
          <Route path='/calendar-events' exact component={CalendarPage} />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App;
