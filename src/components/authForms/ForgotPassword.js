import React, { useRef, useState } from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'
import { BsArrowLeft } from "react-icons/bs"
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
    const emailRef = useRef();
    const { passwordReset } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); 

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setMessage('');
            setError('');
            setLoading(true);
            await passwordReset(emailRef.current.value);
            setMessage('Check your inbox for further instructions');
        } catch {
            /*firebase auto sets password requirements to 6+ characters, otherwise returns an error */
            setError('Failed to reset password');
        }
        setLoading(false);
    }

    return (
        <>
            <div className="validation-form-container">
                <div className="decorative-div-blue"></div>
                <div className='link-btns-container'>
                    <div className='previous-btn-container'>
                        <Link to='/'>
                            <Button className='previous-btn'>
                                <BsArrowLeft className="previous-icon" />
                            </Button>
                        </Link>
                    </div>
                    <div className="login-signin-links-container">
                        <div className='sign-in-btn'>
                            <Link to='/sign-in'>
                                <Button className='login-btn' id="forgot-password-page-login">
                                    SIGN IN
                                </Button>
                            </Link>
                        </div>
                        <div className='sign-up-btn'>
                            <Link to='/sign-up'>
                                <Button className='signup-btn' id="forgot-password-page-signup">
                                    SIGN UP
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <Card>
                    <Card.Body>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        {message && <Alert variant='success'>{message}</Alert>}
                        <Form onSubmit={handleSubmit} className="form-container">
                            <div className="group-container">
                                <Form.Group className="form-group-landing mb-2 mt-3" id="email">
                                    <Form.Control type='email' ref={emailRef} required placeholder="Email" />
                                </Form.Group>
                                <div className='logo-container-login-signup mt-5'>
                                    <div className="logo mt-2"><img className='w-50' src="./img/thing1-logo-hi-res.png" alt="Thing1 logo" /></div>
                                </div>
                            </div>
                            <Button disabled={loading} type="submit" className='w-100 mt-5'>Reset Password</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}
