import React, { useEffect, useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { db, storage } from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import { BsArrowLeft } from "react-icons/bs"

export default function ExpertProfilePage(props) {
    const expert = props.location.state;
    const [url, setUrl] = useState('about/blank');



    const starRating = (reviewRating) => {
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
    
    const defaultImage = async () => {
        await storage.ref("staticFiles").child('Placeholder_person.png').getDownloadURL()
        .then((url) => {
            setUrl(url);
        })
        return url;
    }

      const returnData = (exp) => {
        if(exp) {
            return (
                <>
                    <div className="background-image">
                        <img className="profile-background-image w-100" src={expert.expertImg} />
                    </div>
                    <div className="profile-top-level-container">
                        <h1 className="profile-name mb-3 text-center">{expert.firstName} {expert.lastName}</h1>
                        <h3 className="profile-title text-center">{expert.expertTitle}</h3>
                        <h3 className="profile-blurb text-center">{expert.titleBlurb}</h3>
                        <Button className="long-btn w-100">
                            <Link to="/update-profile">Book Session</Link>
                        </Button>
                    </div>
                    <Card>
                <Card.Body>
                    <Button><img src="#" />Book</Button>
                </Card.Body>
            </Card>
            <Card>
                <Card.Title>
                    <div>
                        <h2>Biography</h2>
                        <Button>Chevron</Button>
                    </div>
                </Card.Title>
                <div>{expert.bio}</div>
            </Card>
            
            <Card>
                <Card.Title>
                    <div>
                        <h2>Experience</h2>
                        <Button>Chevron</Button>
                    </div>
                </Card.Title>
                {expert.experience.map((item, j) => {
                    return (
                        <div key={j}>
                            <div className='experienceTitles'>
                                <h4>
                                    {item.experienceTitle}
                                </h4>
                                <h5>
                                    {item.company}
                                </h5>
                            </div>
                            <div>
                                <p>{item.bio}</p>
                            </div>
                        </div>
                    )
                })}
            </Card>
            <Card>
                <Card.Title>
                    <div>
                        <h2>{expert.reviews.length} Reviews {starRating(expert.reviewRating)}</h2>
                        <Button>Chevron</Button>
                    </div>
                </Card.Title>
                {expert.reviews.map((review, k) => {
                    return (
                        <div key={k}>
                            <div className='revieweeInfo'>
                                <div>
                                    <img className='w-25' src={review.reviewImg} />
                                    <h4>{review.stars}/5</h4>
                                </div>
                                <div className='experienceTitles'>
                                    <h4>
                                        {review.reviewee}
                                    </h4>
                                </div>
                            </div>
                          
                            <div>
                                <p>{review.reviewText}</p>
                            </div>
                        </div>
                    )
                })}
            </Card>
                </>
            )
        }
    }

    return (
        <>
            <div className='profile-container'>
                <div className='previous-btn-container account-page'>
                <Link to='/dashboard'>
                    <Button className='previous-btn'>
                        <BsArrowLeft className="previous-icon" />
                    </Button>
                </Link>
                </div>
                <div className='account'>
                    {returnData(expert)}
                </div>
            </div>
        </>
        
    )
}
