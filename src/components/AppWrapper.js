import { Redirect } from 'react-router-dom';
import { BrowserRouter as Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from '../pages/LandingPage';
import React from 'react'
import Dashboard from './Dashboard';

export default function AppWrapper() {
    const { currentUser } = useAuth();


    if(currentUser) {
      return <Redirect to='/dashboard' component={Dashboard} />
    }
  
     return(
       <div>
         <Redirect to='/welcome' component={LandingPage} />
       </div>
     );
}