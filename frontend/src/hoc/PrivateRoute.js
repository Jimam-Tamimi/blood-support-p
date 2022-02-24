import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, useLocation } from 'react-router-dom'

export default function PrivateRoute({children}) {
    const auth = useSelector(state => state.auth)
    const location = useLocation()
    if(auth.isAuthenticated){            
        return (
            <>
            {children}
            </>
        )
    } 

    else {
        return(
            <>
            {
                    React.Children.map(children, child => (
                        <div>
                           <Route exact path={child.props.path}>
                               <Redirect to={`/login?redirect_url=${location.pathname}`} />
                           </Route>
                        </div>
                     ))
            }
            </>
        )
    }
}