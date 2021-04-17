import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ParticlesBg from "particles-bg";
import MediaCard from "./Card/Card";
import "./HomePage.css";

const HomePage = () => {
  const history = useHistory();
/*
  useEffect(() => {
    console.log(localStorage.getItem("userId"));
    if (!localStorage.getItem("userId")) {
      history.push("/login");
    }
  }, [history]);
*/
  return (
    <>
      <div className="page">
        <MediaCard />
        <ParticlesBg type="color" bg={true} />
      </div>
    </>
  );
};

export default HomePage;
