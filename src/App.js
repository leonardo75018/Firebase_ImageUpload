import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { auth } from "./firebase"
import Login from "./components/Login"
import Nav from "./components/Nav"
import Formations from "./components/Formations"
import Equipe from "./components/Equipe"
import Partenaires from "./components/Partenaires"
import Benevoles from "./components/Benevoles"

import "./App.css"




function App() {
  const [firebaseUser, setFirebaseUser] = useState(false)

  React.useEffect(() => {
    auth.onAuthStateChanged(user => {
      // console.log(user)
      if (user) {
        setFirebaseUser(user)
      } else {
        setFirebaseUser(null)
      }

    })
  }, [])

  return firebaseUser !== false ? (
    <Router>
      <Nav firebaseUser={firebaseUser} />
      <Route path="/login" exact> <Login /> </Route>
      <Route path="/formations" exact> <Formations /> </Route>
      <Route path="/equipe" exact> <Equipe /> </Route>
      <Route path="/partenaires" exact> <Partenaires /> </Route>
      <Route path="/benevoles" exact> <Benevoles /> </Route>
    </Router>
  ) : (
      <p>Loading...</p>
    );
}

export default App;
