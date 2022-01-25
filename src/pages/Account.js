import React, { useEffect, useState } from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db, storage } from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs"

function Account() {
const { currentUser } = useAuth();
const expertsCollectionRef = collection(db, 'experts');
const [loading, setLoading] = useState(false);
const [profileUser, setProfileUser] = useState([]);
const [url, setUrl] = useState('../../img/blank-profile-picture-973460.png')

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
        if(user.expertImg === undefined || user.expertImg === '') {
            return url;
        } else {
            setUrl(user.expertImg);
        }
    }
    return url;
}

const checkSession = (user) => {
    if (user.upcomingSessions) {
        return (
            <div>
                <p>You have upcoming Sessions</p>
            </div>
        )
    }

    return (
        <div>
            <p className='text-center'>No upcoming sessions</p>
        </div>
        
    )
}

const checkExpertFavorites = (user) => {
    if (user.favoriteExperts) {
        return (
            <div>
                <p>Saved Experts</p>
            </div>
        )
    }

    return (
        <div>
            <p className='text-center'>No Saved Experts</p>
        </div>
        
    )
}

const checkReviews = (user) => {
    if (user.isExpert) {
        return (
            <div>
                <p>These are your current Reviews</p>
            </div>
        )
    }
    if (user.reviewsGiven) {
        return (
            <div>
                <p>Reviews Written</p>
            </div>
        )
    }

    return (
        <div>
            <p className='text-center'>No Reviews</p>
        </div>
        
    )
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
                <div className='profile-items-container sessions-container'>
                    <h3>Upcoming Sessions</h3>
                        {checkSession(profileUser)}
                </div>
                <div className='profile-items-container saved-expert-container'>
                    <h3>Favorite Experts</h3>
                        {checkExpertFavorites(profileUser)}
                </div>
                <div className='profile-items-container saved-expert-container'>
                    <h3>Reviews</h3>
                        {checkReviews(profileUser)}
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