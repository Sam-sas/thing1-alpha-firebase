import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

//wrapper for current routes so there isn't a way to access the dashboard without logging in first
export default function PrivateRoute({ component: Component, ...rest}) {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
                return currentUser ? <Component {...props} /> : <Redirect to='/login' />
            }}
        ></Route>
    )
}
