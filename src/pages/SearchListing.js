//icons + ui
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { BsSearch } from "react-icons/bs";
import { Card, Button, Alert } from 'react-bootstrap'

//framework
import React, { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app';
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

//storage + db
import { db, storage } from '../firebase'
import { getStorage, ref, getDownloadURL  } from "firebase/storage";
import { collection, getDocs, query, where } from 'firebase/firestore'


export default function SearchListing() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const expertsCollectionRef = collection(db, 'experts');
  const [url, setUrl] = useState('');
  const [isActive, setActive] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

// Get a reference to the storage service, which is used to create references in your storage bucket
const defaultImage = async () =>
  await storage.ref("staticFiles").child('Placeholder_person.png').getDownloadURL()
  .then((url) => {
    setUrl(url);
  })

  useEffect(() => {
    const getExperts = async () => {
      const expertData = await getDocs(expertsCollectionRef);
      setExperts(expertData.docs.map((doc) => ({
          ...doc.data(), id: doc.id
      })));
    }

    getExperts();
}, []);

const checkImg = (img)  => {
  if(img == '') {
    defaultImage();
    return url;
  }
  return img;
}

function starRating(reviewRating) {
  if(reviewRating < 1) {
    return <p>Currently Unreviewed</p>
  } else {
    let totalStars = []
    for (var i = 0; i < reviewRating; i++) {
      totalStars.push( 
        <label className="star">
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="#fecb46" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </label>
      )
    }
    return (
      <div className="reviewRatings">{totalStars}</div>
    )
  }
}
const favoriteExpert  = () =>  {
  setActive(!isActive);
  setFavorite(!isFavorite);
}; 

const searchDbReset = async (ref) => {
  if (ref) {
    const expertData = await getDocs(ref);
    setExperts(expertData.docs.map((doc) => ({
        ...doc.data(), id: doc.id
    })));
  }
}

const searchDb = async (searchTerm) => {
  if (searchTerm == '') {
    return experts;
  }

  setLoading(true);
  const items = [];
  console.log(searchTerm);
  firebase.firestore().collection('experts').where('firstName', '==', searchTerm).onSnapshot((QuerySnapshot) => {
    const items = [];
    QuerySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    setExperts(items);
  });

  firebase.firestore().collection('experts').where('lastName', '==', searchTerm).onSnapshot((QuerySnapshot) => {
    QuerySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    setExperts(items);
  });

  firebase.firestore().collection('experts').where('expertTitle', '==', searchTerm).onSnapshot((QuerySnapshot) => {
    QuerySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    setExperts(items);
  });

  console.log(items);
  setLoading(false);
}

const returnData = (exp) => {
  if (exp) {
    return (
      <>
        <Card className='mt-5'>
          <div className='searchListing'>
            <div className="searchFilterBar">
              <div className='searchBarActions'>
                <div className="returnBack">
                  <Button className="orange" onClick={() => {searchDbReset(expertsCollectionRef)}}>Reset</Button></div>
                <div className="searchBar">
                  <input
                    id="categorySearch"
                    type="text"
                    placeholder="information Security"
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                    }} />
                  <Button onClick={() => { searchDb(searchTerm) }}>Search</Button>
                </div>
              </div>
              <div className="filterOptions">
                <button className="button filterButton">Filter</button>
                <button className="button categoryFilter">Categories</button>
              </div>
              <div className="logo w-100" id="searchLogo"><img className="w-25" src="./img/thing1-logo-hi-res.png" /></div>
            </div>
          </div>
        </Card>
        <Card className="search-list-card">
          <Card.Body className='mt-1'>
            <div className="searchResults">
              <ul className="expertsFound">
                {experts.map((expert, i) => {
                  return (
                    <div key={i}>
                      <Link
                        to={{
                          pathname: `/profile-page/${expert.firstName}-${expert.lastName}`,
                          state: expert,
                        }}>
                        <li>
                          <div className="expertsByCategory">
                            <div className="expertImage w-25"><img className="img-thumbnail" src={checkImg(expert.expertImg)} alt="expert" /></div>
                            <div className="expertImmediateInforation">
                              <p className="expertName" >{expert.firstName} {expert.lastName}</p>
                              <p className="expertTitle" >{expert.expertTitle}</p>
                              <div className="expertReview">{starRating(expert.reviewRating)}</div>
                            </div>
                          </div>
                          <div className="expertExtraInformation">
                            <div className={isActive ? 'activeFavorite' : 'inactiveFavorite'} onClick={favoriteExpert}>{isFavorite ? <AiOutlineHeart /> : <AiFillHeart />}</div>
                            <div className="expertCost">{expert.expertCost}</div>
                          </div>
                        </li>
                      </Link>
                    </div>
                  )
                })}
              </ul>
            </div>
          </Card.Body>
        </Card>
      </>
    )
  }
}

  return (
    <>
      {returnData(experts)}
    </>
  )
}


