import React from 'react';
import { Link } from 'react-router-dom';
import {Form, Button, Card, Alert } from 'react-bootstrap';

export default function Dashboard() {
  return (
    <>  
        <div className='dashboard'>
            <div className='dashboard-container'>
                <div className='logo-container' id="welcome-logo">
                    <div className="logo"><img src="./img/thing1-logo-hi-res.png" alt="Thing1 logo" /></div>
                </div>
                <div>
                    <h1>Get Started</h1>
                    <div className='button-container'>
                        <Button className='w-100 mt-3 blue long-btn'>
                            <Link to="/account-page" className="forgot-password">View your Profile</Link>
                        </Button>
                        <Button className='w-100 mt-3 orange long-btn'>
                            <Link to="/search-listing" className="forgot-password">Find an Expert</Link>
                        </Button>
                        <Button className='w-100 mt-3 blue long-btn'>
                            <Link to="/update-profile" className="forgot-password">Be an Expert</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
