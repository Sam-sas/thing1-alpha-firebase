import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'



export default function LandingPage() {
    return (
        <>
        <div className='landing-page'>
            <div className='logo-container'>
                <div className="logo"><img className='w-75' src="./img/thing1-logo-hi-res.png" alt="Thing1 logo" /></div>
                <p className='slogan'>Find Your Niche</p>
            </div>
            <div className='login-sign-up-landing-container'>
                <Link to='/login'>
                    <Button className='login-btn'>Login</Button>
                </Link>
                <Link to='/signup'>
                    <Button className='signup-btn'>Sign Up</Button>
                </Link>
            </div>
        </div>
        </>
    )
}
