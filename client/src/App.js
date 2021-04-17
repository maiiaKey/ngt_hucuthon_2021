import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import HomePage from "./components/homePage/HomePage";
import LoginPage from "./components/loginPage/LoginPage";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/home" component={HomePage} />
          <Redirect from="/" to="home" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
