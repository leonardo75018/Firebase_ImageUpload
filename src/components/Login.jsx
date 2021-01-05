import React, { useState } from 'react'
import { auth, db } from "../firebase"
import { withRouter } from "react-router-dom";


const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [isRegister, setIsRegister] = useState(true)


    const dataProcess = e => {
        e.preventDefault()
        if (!email.trim()) {
            setError("champ email vide")
            return
        }

        if (!password.trim()) {
            setError("champ password vide")
            return
        }
        if (password.length < 6) {
            setError("Votre password doit contenir minimum 6 caractères")
            return
        }
        setError(null)
        if (isRegister) {
            register()
        } else {
            login()
        }
    }

    const register = React.useCallback(async () => {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, password)
            console.log(res.user)
            await db.collection("users").doc(res.user.email).set({
                email: res.user.email,
                uid: res.user.uid
            })
            setEmail("")
            setPassword("")
            setError(null)

        } catch (error) {
            console.log(error)
            if (error.code === "auth/invalid-email") {
                setError("Veuillez utiliser une addresee email valide")
            }
            if (error.code === "auth/email-already-in-use") {
                setError("Cette adresse email est déjà utilisé")
            }


        }
    }, [email, password])

    const login = React.useCallback(async () => {
        try {
            const res = await auth.signInWithEmailAndPassword(email, password)
            props.history.push("/formations")


        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setError("Ce compte utilisateur n'existe pas")
            }
            if (error.code === "auth/wrong-password") {
                setError("Mot de passe incorrect")
            }

            console.log(error)
        }

    }, [email, password, props.history])




    return (
        <div className="mt-5">
            <h3 className="text-center">{
                isRegister ? "Création de compte" : "Connectez-vous"
            }</h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    {
                        error && (
                            <div className="alert alert-danger">{error}</div>
                        )
                    }
                    <form onSubmit={dataProcess}>
                        <input
                            type="email"
                            className="form-control mb-2"
                            placeholder="Votre Email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}

                        />
                        <input
                            type="password"
                            className="form-control mb-2"
                            placeholder="Votre password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}

                        />
                        <button
                            className="btn btn-lg btn-dark btn-block"
                            type="submit"
                        >
                            {
                                isRegister ? "Créer mon compte" : "Connexion"
                            }
                        </button>
                        <br />
                        <button
                            className="btn btn-sm btn-info btn-block"
                            type="button"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {
                                isRegister ? "¿Vous avez déjà un compte?" : "Vous n'avez pas de compte"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login) 
