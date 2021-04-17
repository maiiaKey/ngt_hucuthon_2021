import React, { useState } from "react";
import ParticlesBg from "particles-bg";
import {
  Card,
  TextField,
  Button,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import "./LoginPage.css";
import { useHistory } from "react-router-dom";

const LoginPage = () => {
  const history = useHistory();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitSignIn = () => {
    setIsLoading(true);
    fetch("http://localhost:4000/signin/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: login,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then(async (user) => {
        setIsLoading(false);
        if (user.Id) {
          await localStorage.setItem("userId", user.Id);
        } else {
          alert("Wrong email or password");
          localStorage.setItem("userId", null);
        }
        return user;
      })
      .then((user) => {
        if (user.Id) {
          history.push("/home");
        }
      })
      .catch(console.log);
  };

  return (
    <>
      <div className="page">
        <Card className={`login-card${!isLoading ? " notLoading" : ""}`}>
          {isLoading && <LinearProgress />}
          <form className="login-wrapper" autoComplete="off">
            <LockIcon color="primary" fontSize="large" />
            <Typography variant="h4" component="h4">
              Sign In
            </Typography>
            <TextField
              required
              fullWidth
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              id="input email"
              label="Email"
              variant="outlined"
              type="email"
            />
            <TextField
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="input password"
              label="Password"
              variant="outlined"
              type="password"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!login || !password || isLoading}
              onClick={onSubmitSignIn}
            >
              Submit
            </Button>
          </form>
        </Card>
      </div>
      <ParticlesBg type="color" bg={true} />
    </>
  );
};

export default LoginPage;
