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
                    React.Children.map(children, child => {
 
                        return (
                        <>
                           <Route exact={child.props.exact === true} path={child.props.path}>
                               <Redirect to={`/login?redirect_url=${location.pathname.replaceAll('/', '[1234]')}`} />
                           </Route>
                        </>
                     )})
            }
            </>
        )
    }
}