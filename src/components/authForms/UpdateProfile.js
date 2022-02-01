import React, { useRef, useState, useEffect } from 'react'
import {Form, Button, Card, Alert, FloatingLabel } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db, storage } from '../../firebase'
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'

export default function UpdateProfile() {
    //references
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const firstNameRef = useRef();

    let [initialData, setInitialData] = useState([]);
    const { currentUser, updatePassword, updateEmail } = useAuth();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    //assign data to user specific items
    const [expFirstName, setExpFirstName] = useState("");
    const [expLastName, setExpLastName] = useState("");
    const [expPhone, setExpPhone] = useState("");
    const [expImg, setExpImg] =  useState("");
    //to add to storage
    const [profileImage, setProfileImage] = useState("");
    const[imgProgress, setImgProgress] = useState(0);
    const[credentialProgress, setCredentialProgress] = useState(0);
    const [expertCredentialStorageFiles, setExpertCredentialStorageFiles] = useState([]);
    //information to be reviewed by Admin
    const [expCategories, setExpCategories] = useState([]);
    const [expTitle, setExpTitle] = useState("");
    const [expCost, setExpCost] = useState(0);
    const [expCredentials, setExpCredentials] = useState([]);

    //TODO: move to a context file similar to authContext

    const updateUserItems = async (userId, doc) => {
        const userDoc = doc(db, "experts", userId);
        const updatedFields = {
            firstName: expFirstName,
            lastName: expLastName,
            expertImg: expImg,
            phoneNumber: expPhone,
        }
        await updateDoc(userDoc, updatedFields);
    }

    const updateExpertItems = async (user, doc) => {
        const userDoc = doc(db, "experts", user);
        const updatedFields = {
            expertCategories: expCategories,
            expertTitle: expTitle,
            expertCost: expCost,
            phoneNumber: expPhone,
            expertCredentials: expCredentials
        }
        await updateDoc(userDoc, updatedFields);
    }

    const addCredentialFiles = e => {
        for(let i=0; i<e.target.files.length; i++) {
            const file = e.target.files[i];
            file["id"] = Math.random();
            setExpertCredentialStorageFiles((prevState) => [...prevState, file]);
        }
    };

    const uploadImgFiles = () => {
        try {
            if (currentUser.uid) {
                const uploadTask = storage.ref(`${currentUser.uid}/${profileImage.name}`).put(profileImage);
                uploadTask.on(
                    "state_changed",
                    snapshot => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        setImgProgress(progress);
                    },
                    error => {
                        console.log(error);
                    },
                    () => {
                        storage.ref(`${currentUser.uid}`).child(profileImage.name).getDownloadURL().then(url => {
                            setExpImg((prevState => [...prevState, url]));
                        });
                    }
                );
            }
        } catch(err) {
            console.log(err);
        }  
    };

    const uploadCredentialFiles = () => {
        const promises = [];
        expertCredentialStorageFiles.map((file) => {
            const uploadTask = storage.ref(`${currentUser.uid}/${file.name}`).put(file);
            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setCredentialProgress(progress);
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage.ref(`${currentUser.uid}`).child(file.name).getDownloadURL().then(urls => {
                        setExpCredentials((prevState => [...prevState, urls]));
                        // console.log(expCredentials);
                    });
                }
            );
        })
        Promise.all(promises).then(() => alert("all images uploaded")).catch((err) => console.log(err));
    };

    //submit functions
    function handleAuthSubmit(e) {
        e.preventDefault();
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        const promises = [];
        setLoading(true);
        setError('');
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value));
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value));
        }

        Promise.all(promises).then(() => {
            history.push('/profile-page');
        }).catch(() => {
            setError('Failed to update Account');
        }).finally(() => {
            setLoading(false);
        });
    }

    async function handleDbUserSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            if (profileImage) {
                uploadImgFiles();
            }
            defaultData(initialData);
            console.log(expFirstName)
            await updateUserItems(currentUser, doc);
        } catch(err) {
            setError('Failed to add additional data');
        }
        setLoading(false);
    }

    async function handleDbExpertSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            defaultData(initialData);
            await updateExpertItems(currentUser, doc);
        } catch(err) {
            setError('Failed to add additional data');
        }
        setLoading(false);
    }

    const expertCheck = (isExpert) => {
        if(isExpert) {
            return (
                <h2 className='text-center mb-4'>Update your Expertise</h2>
            )
        }
        return (
            <h2 className='text-center mb-4'>Apply to be an Expert</h2>
        )
    }

    const pushToLocalArray = (userArray) => {
        
    }

    const addToCategoryArray = (userArray) => {
        
    }

    //TODO: bad practice, figure out what the real issue is ASAP
    const defaultData = (data) => {
        if(expFirstName == '') {
            setExpFirstName(data.firstName);
        }
        if(expLastName == '') {
            setExpLastName(data.lastName);

        }
        if(expPhone == '') {
            setExpPhone(data.phoneNumber);
        }
        if(expCategories == []) {
            setExpCategories(data.expCategories);

        }
        if(expImg == '') {
            setExpImg(data.expertImg);
        }
        if(expTitle == '') {
            setExpTitle(data.expertTitle);
        }
        if(expCost == 0) {
            setExpCost(data.expertCost);
        }
        if(expCredentials == []) {
            setExpCredentials(data.expertCredentials);

        }
    }

    //wait until we get the collection, then query collection for user specific information
    useEffect(() => {
        const getExperts = async () => {
            const q = query(collection(db, "experts"), where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                setInitialData(doc.data());
            });
        }
        getExperts();
    }, []);

        return (
            <>
                {/* login credential card */}
                <div className='validation-form-container'>
                    <div className="decorative-div-blue"></div>
                    <Card> 
                        <Card.Body>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Form onSubmit={handleAuthSubmit} className="form-container">
                                <div className="group-container">
                                    <h2 className='text-center mb-4'>Change Your Login</h2>
                                    <Form.Group id="email" className="form-group-landing mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type='email' ref={emailRef} required defaultValue={currentUser.email} />
                                    </Form.Group>
                                    <Form.Group id="password" className="form-group-landing mb-3">
                                        <Form.Label>Password (leave blank to keep the same)</Form.Label>
                                        <Form.Control type='password' ref={passwordRef} />
                                    </Form.Group>
                                    <Form.Group id="password-confirm" className="form-group-landing mb-3">
                                        <Form.Label>Password Confirmation</Form.Label>
                                        <Form.Control type='password' ref={passwordConfirmRef} defaultValue={currentUser.password} />
                                    </Form.Group>
                                    <Button disabled={loading} type="submit" className='w-100 mt-3 mb-3 update-button'>Update</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                    {/* update non-admin related items card */}
                    <Card>
                        <Card.Body>
                            <h2 className='text-center mb-4'>Update Profile</h2>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Form onSubmit={handleDbUserSubmit}>
                                <Form.Group id="updateFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type='name' 
                                        onChange={(event) => {
                                            setExpFirstName(event.target.value)}} 
                                        defaultValue={initialData.firstName} />
                                </Form.Group>
                                <Form.Group id="updateLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type='name'
                                        onChange={(event) => {
                                            setExpLastName(event.target.value)}}
                                        defaultValue={initialData.lastName} />
                                </Form.Group>
                                <Form.Group id="updatePhoneNum">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type='tel'
                                    onChange={(event) => {
                                        setExpPhone(event.target.value)}}
                                    defaultValue={initialData.phoneNumber} />
                                </Form.Group>
                                <Card.Body>
                                    <input type="file" onChange={(e)=>{setProfileImage(e.target.files[0])}} />
                                    <progress value={imgProgress} max="100" />
                                </Card.Body>                          
                                <Button disabled={loading} type="submit" className='w-100 mt-3'>Update</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            {expertCheck(initialData.isExpert)}
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Form onSubmit={handleDbExpertSubmit}>
                                <Form.Group id="updateExpCategories">
                                    <Form.Label>Categories</Form.Label>
                                        <Form.Control type="text" defaultValue={initialData.expertCategories} onChange={pushToLocalArray} />
                                        <Button onClick={addToCategoryArray}>Add Category</Button>
                                </Form.Group>
                                <Form.Group id="updateTitle">
                                    <Form.Label>Expertise Title</Form.Label>
                                    <Form.Control type='title' defaultValue={initialData.expertTitle} />
                                </Form.Group>
                                <Form.Group id="updateCost">
                                    <Form.Label>Cost of Teaching</Form.Label>
                                    <Form.Control type='number' defaultValue={initialData.expertCost} />
                                </Form.Group>
                                <Card.Body>
                                    <input type="file" multiple onChange={addCredentialFiles} />
                                    <Button onClick={uploadCredentialFiles}>Upload</Button>
                                    <progress value={credentialProgress} max="100" />
                                </Card.Body>
                                <Button disabled={loading} type="submit" className='w-100 mt-3'>Update</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className='w-100 text-center mt-2'>
                    <Link to="/profile-page">Return to profile</Link>
                    </div>
                -</div>
            </>
        )
}
