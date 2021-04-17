import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ParticlesBg from "particles-bg";
import "./HomePage.css";

import Card from "./Card/Card"

const LoginPage = () => {
  const history = useHistory();

  useEffect(() => {
    console.log(localStorage.getItem("userId"));
    if (!localStorage.getItem("userId")) {
      history.push("/login");
    }
  }, [history]);

  return (
    <>
      <div className="page">
        <Card />
      </div>
      <ParticlesBg type="color" bg={true} />
    </>
  );
};

export default LoginPage;
