import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { auth } from "../firebase"
import { withRouter } from "react-router-dom";



const Nav = (props) => {

    const logout = () => {
        auth.signOut()
            .then(() => {
                props.history.push("/login")
            })
    }

    return (
        <div className="navbar navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Auth</Link>
            <div>
                <div className="d-flex">
                    <Link className="btn btn-dark mr-2" to="/formations" exact>Formations</Link>
                    <Link className="btn btn-dark mr-2" to="/equipe" exact>Equipe</Link>
                    <Link className="btn btn-dark mr-2" to="/partenaires" exact>Partenaires</Link>

                    <Link className="btn btn-dark mr-2" to="/login" exact>
                        { }
                    </Link>
                    {
                        props.firebaseUser !== null ? (
                            <button
                                className="btn btn-dark"
                                onClick={() => logout()}
                            >
                                Logout
                            </button>
                        ) : (
                                <Link className="btn btn-dark mr-2" to="/login" exact>Login </Link>
                            )
                    }


                </div>
            </div>

        </div>
    )
}

export default withRouter(Nav)