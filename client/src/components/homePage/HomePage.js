import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, TextField } from "@material-ui/core";
import ParticlesBg from "particles-bg";
import "./HomePage.css";

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
        <Card className="home-page-card">
          <TextField
            fullWidth
            id="input email"
            label="Pet name"
            variant="outlined"
            type="text"
          />
        </Card>
      </div>
      <ParticlesBg type="color" bg={true} />
    </>
  );
};

export default LoginPage;
