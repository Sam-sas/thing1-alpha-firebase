import React, {useState} from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {
    const [value, onChange] = useState(new Date());


    return (
        <div className='mt-5'>
            <Calendar
             onChange={onChange}
             value={value}
              />
        </div>
    )
}
