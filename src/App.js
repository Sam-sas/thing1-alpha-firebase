import React from "react";

//navigation
import Navigation from "./components/navigation/Navigation";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//authorization
import { AuthProvider } from "./contexts/AuthContext";
import UpdateProfile from "./components/authForms/UpdateProfile";
import Signup from "./components/authForms/Signup";
import ExpertValidationForm from "./components/authForms/ExpertValidationForm"
import Login from "./components/authForms/Login";
import ForgotPassword from "./components/authForms/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import AppWrapper from "./components/AppWrapper";
//pages
import Dashboard from "./pages/Dashboard";
import SearchListing from './pages/SearchListing'
import Account from './pages/Account';
import ExpertProfilePage from "./pages/ExpertProfilePage";
import About from './pages/About';
import Contact from './pages/Contact';
import CalendarPage from './pages/CalendarPage';
import LandingPage from './pages/LandingPage';



function App() {
  return (
    <Router>
      <AuthProvider>
        {/* REMOVE: USE NAVIGATION LAYOUT TO MAKE IT DYNAMIC, LEAVE ONLY THE SWITCH IN APP */}
        <Navigation />  
        <Switch>
          <Route exact path="/" component={AppWrapper} />
          <Route path="/sign-up" component={Signup} />
          <Route path="/sign-in" component={Login} />
          <Route path="/welcome" component={LandingPage} />
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
