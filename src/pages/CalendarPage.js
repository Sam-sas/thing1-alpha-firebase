import React, { useState, useEffect } from "react"
import { useAuth } from '../contexts/AuthContext'
import moment from 'moment'
import { db } from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore"
import Calendar from 'react-calendar'

export default function CalendarPage() {
    const [date, setDate] = useState(new Date())
    const [sessions, setSessions] = useState([]);
    const [profileUser, setProfileUser] = useState();
    const { currentUser } = useAuth();

    const changeDate = (e) => {
        setDate(e)
      }

    const returnData = (user) => {
        if(user) {
            return (
                <>
                    <div className='calendar-page'>
                        <div className="thing1-logo">
                            <img id="calendar-logo" src="../img/thing1-logo-hi-res.png" alt="thing1 logo"/>
                        </div>
                        {/* {sessionsData} */}
                        <Calendar
                            onChange={changeDate}
                            value={date}
                        />
                        {/* <div>
                            <p>Current selected date is <b>{moment(date).format('MMMM Do YYYY')}
                            </b></p>
                        </div> */}
                    </div>
                </>
            )
        }
    }


    return (
        <div>
           {returnData(currentUser)} 
        </div>
    )
}