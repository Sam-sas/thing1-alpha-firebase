import React, { useState } from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../firebase'
import { collection, addDoc} from 'firebase/firestore'

export default function ExpertValidationForm() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const expertsCollectionRef = collection(db, 'experts');
    const { currentUser } = useAuth();
    //assign data to document fields
    const [expFirstName, setExpFirstName] = useState("");
    const [expLastName, setExpLastName] = useState("");
    const [expPhone, setExpPhone] = useState("");
    const expPreference = [];
    //information to be completed on profile
    const expCategories = [];
    const expTitle = "";
    const expCost = 0;
    const expImg = "";
    const expReviews = 0;
    const isExpert = false;

    //TODO: create global toggle method
    const togglePreference = (preference) => {
        if (!(expPreference.indexOf(preference) > -1)) {
            expPreference.push(preference);
        } else {
            expPreference.pop(preference);
        }
    }

    const createExpert = async (user) => {
        console.log(user);
        try {
            await addDoc(expertsCollectionRef, {
                uid: user.uid, 
                firstName: expFirstName,
                lastName: expLastName,
                expertCategories: expCategories,
                expertCost: expCost,
                expertImg: expImg,
                expertTitle: expTitle,
                isExpert: isExpert,
                reviewRating: expReviews,
                phoneNumber: expPhone,
                EmailAddress: user.email,
                communicationPreference: expPreference,
            });
        } catch(err) {
            console.error(err + " " + currentUser);
            alert(err.message + currentUser);
        }
       
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await createExpert(currentUser);
            history.push('/');
        } catch {
            setError('Failed to add additional data');
        }
        setLoading(false);
    }

    return (
        <>
            <div className='validation-form-container'>
                <div className="decorative-div-blue"></div>

                <Card>
                    <Card.Body>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Form className="form-container">
                            <div className="group-container">
                            <p className='text-center'>Tell us a little about yourself.</p>
                            <Form.Group id="firstName" className="form-group-landing mb-5 mt-3">
                                <Form.Control type='name' 
                                    placeholder='First Name'
                                    onChange={(event) => {
                                    setExpFirstName(event.target.value);}} />
                            </Form.Group>
                            <Form.Group id="lastName" className="form-group-landing mb-5 mt-3">
                                <Form.Control type='name'
                                    placeholder='Last Name'
                                    onChange={(event) => {
                                    setExpLastName(event.target.value);}} />
                            </Form.Group>
                            <Form.Group id="phoneNumber" className="form-group-landing mb-5 mt-3">
                                <Form.Control type='tel' 
                                    placeholder='Phone Number'
                                    onChange={(event) => {
                                        setExpPhone(event.target.value);}} />
                            </Form.Group>
                            <Form.Group className="form-group-landing mb-5 mt-3">
                                <Form.Check type="switch" id="custom-switch" label="Email"
                                    onChange={() => togglePreference("email")}/>
                                <Form.Check type="switch" id="custom-switch" label="Text"
                                    onChange={() => togglePreference("text")}/>
                                <Form.Check type="switch" id="custom-switch" label="App Notifications"
                                    onChange={() => togglePreference("app Notifications")}/>
                            </Form.Group>
                            <div className='logo-container-login-signup'>
                                    <div className="logo"><img className='w-50' src="./img/thing1-logo-hi-res.png" alt="Thing1 logo" /></div>
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                <div className='text-center mt-2 form-button-submissions-container'>
                    <Button disabled={loading} type="submit" className='w-100 mt-3' id="submit-button" onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
            
        </>
    )
}
