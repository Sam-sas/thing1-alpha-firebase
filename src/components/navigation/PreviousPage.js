import React from 'react'
import { GrLinkPrevious } from "react-icons/gr"
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

//TODO: update this page to working condition -- props through chrildren
export default function PreviousPage(props) {
    console.log(props);
    console.log(location);
    return (
        <div>
            <Link to={props}>
                <Button className='previous-btn'>
                    <GrLinkPrevious />
                </Button>
            </Link>
        </div>
    )
}
