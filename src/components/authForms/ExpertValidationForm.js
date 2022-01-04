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
            <Button className='w-100 mt-3'>Previous</Button>

            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>Expert Validation Form</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form>
                        <Form.Group id="firstName">
                            <Form.Control type='name' 
                                placeholder='First Name'
                                onChange={(event) => {
                                setExpFirstName(event.target.value);}} />
                        </Form.Group>
                        <Form.Group id="lastName">
                            <Form.Control type='name'
                                placeholder='Last Name'
                                onChange={(event) => {
                                setExpLastName(event.target.value);}} />
                        </Form.Group>
                        <Form.Group id="phoneNumber">
                            <Form.Control type='tel' 
                                placeholder='Phone Number'
                                onChange={(event) => {
                                    setExpPhone(event.target.value);}} />
                        </Form.Group>
                        {/* <Form.Group id="exoertFormEmail">
                            <Form.Control type='email' 
                                placeholder='Email'
                                onChange={(event) => {
                                    setExpEmail(event.target.value);}} />
                        </Form.Group> */}
                        <Form.Group>
                            <Form.Check type="switch" id="custom-switch" label="Email"
                                onChange={() => togglePreference("email")}/>
                            <Form.Check type="switch" id="custom-switch" label="Text"
                                onChange={() => togglePreference("text")}/>
                            <Form.Check type="switch" id="custom-switch" label="App Notifications"
                                onChange={() => togglePreference("app Notifications")}/>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                <Button disabled={loading} type="submit" 
                    className='w-100 mt-3' onClick={handleSubmit}>Skip for now</Button>
                <Button disabled={loading} type="submit" className='w-100 mt-3' onClick={handleSubmit}>Next</Button>
            </div>
        </>
    )
}
