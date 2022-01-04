import React, { useEffect, useState } from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db, storage } from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs"



//Account Page, where adjustments can be made, people added per dealer.
function Account() {
const { currentUser } = useAuth();
const expertsCollectionRef = collection(db, 'experts');
const [loading, setLoading] = useState(false);
const [profileUser, setProfileUser] = useState([]);
const [url, setUrl] = useState('about/blank')

useEffect(() => {
    if  (currentUser) {
        getCurrentUser(currentUser.uid);
        checkImg(expertsCollectionRef, profileUser);
    }
}, []);


const getCurrentUser = async (uid) => {
    const q = query(collection(db, "experts"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        setProfileUser(doc.data());
    });
}

const checkImg = (ref, user)  => {
    if (ref) {
        defaultImage();
        if(user.expertImg == '') {
            return url;
        } else {
            setUrl(user.expertImg);
        }
    }
    return url;
}

const defaultImage = async () => {
    await storage.ref("staticFiles").child('Placeholder_person.png').getDownloadURL()
    .then((url) => {
        setUrl(url);
    })
    return url;
}

const returnData = (user) => {
    if(user) {
        return (
            <>
                <div className="background-image">
                    <img className="profile-background-image w-100" src={url} />
                </div>
                <div className="profile-top-level-container">
                    <h1 className="profile-name mb-3 text-center">{profileUser.firstName} {profileUser.lastName}</h1>
                    <Button className="long-btn w-100">
                        <Link to="/update-profile">Update Profile</Link>
                    </Button>
                </div>
            </>
        )
    }
}

return (
    <>
        <div className="profile-container">
            <div className='previous-btn-container account-page'>
                <Link to='/dashboard'>
                    <Button className='previous-btn'>
                        <BsArrowLeft className="previous-icon" />
                    </Button>
                </Link>
            </div>
            <div className='account'>
                {returnData(currentUser)}
            </div>
        </div>
    </>
    
)
}

export default Account;