import React, { useRef, useState } from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { GrLinkPrevious } from "react-icons/gr"
import { BsArrowLeft } from "react-icons/bs"

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }
        try {
            setError('');
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            history.push('/sign-up-validation-form');
        } catch {
            /*firebase auto sets password requirements to 6+ characters, otherwise returns an error */
            setError('Failed to create an account');
        }
        setLoading(false);
    }

    return (
        <>
            <div className="login-signup-container">
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
                            <Link to='/login'>
                                <Button className='login-btn' id="signup-page-login">
                                    SIGN IN
                                </Button>
                            </Link>
                        </div>
                        <div className='sign-up-btn'>
                            <Link to='/signup'>
                                <Button className='signup-btn' id="signup-page-signup">
                                    SIGN UP
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                
                <Card>
                    <Card.Body>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Form onSubmit={handleSubmit} className="form-container">
                            <div className="group-container">
                                <Form.Group className="form-group-landing mb-5 mt-3" id="email">
                                    <Form.Control type='email' ref={emailRef} required placeholder="Email" />
                                </Form.Group>
                                <Form.Group className="form-group-landing mb-5" id="password">
                                    <Form.Control type='password' ref={passwordRef} required placeholder='Password' />
                                </Form.Group>
                                <Form.Group className="form-group-landing" id="password-confirm">
                                    <Form.Control type='password' ref={passwordConfirmRef} required placeholder="Confirm Password" />
                                </Form.Group>
                                <div className='logo-container-login-signup'>
                                    <div className="logo"><img className='w-50' src="./img/thing1-logo-hi-res.png" alt="Thing1 logo" /></div>
                                </div>
                            </div>
                            <Button disabled={loading} type="submit" className='w-100 mt-5 long-btn'>Continue</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
            
        </>
    )
}
