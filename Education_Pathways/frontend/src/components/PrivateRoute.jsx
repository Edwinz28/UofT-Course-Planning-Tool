import { Route, Redirect } from 'react-router-dom'
import API from '../api'
import { useState, useEffect } from 'react'

// Note: This password feature serves as a proof of concept
// Ideally the password will be hashed in a database, in this case we will
// string compare in the backend
const PrivateRoute = ({component, ...rest}) => {
    // isLoading acts as a synchronization variable as the post request is async.
    // This ensures that the route will render AFTER the post request is done
    const [isLoading, setLoading] = useState(true)
    const [isAuth, setAuth] = useState(false)
    useEffect(() => {
        let auth = prompt("Please enter the administrative password. Hint: ECE444")
        API.post(`/admin/auth?pw=${auth}`).then(res => {
            setAuth(res.data.isAuth)
            setLoading(false)
        })
    }, [])

    if (isLoading) {
        return null
    } else {
        return(
            <Route {...rest}>
                {isAuth ? component : <Redirect to='/'/>}
            </Route>
        )
    }
}

export default PrivateRoute