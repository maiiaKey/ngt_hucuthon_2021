import React, { useEffect, useState } from "react";
import { Card } from "@material-ui/core";
import "./Card.css";

import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import LinearWithValueLabel from "./ProgressBar";
import level_1_base from "./gifs/Parrot_1.gif";
import level_2_base from "./gifs/Parrot_2.gif";
import level_3_base from "./gifs/Parrot_3.gif";

const resolveLevelFromMarks = (totalMarks) => {
  console.log(totalMarks);
  return Math.floor(Math.sqrt(totalMarks / 100));
};

const resolveProgressFromMarks = (totalMarks, newLevel) => {
  return 100*(totalMarks/(200*newLevel-100));
}

const resolveBaseGifFromLevel = (level) => {
  console.log(level);
  if (level <= 1) {
    return level_1_base;
  }
  if (level <= 2) {
    return level_2_base;
  }
  if (level <= 3) {
    return level_3_base;
  }
  return level_3_base;
};

const resolveLevelUpGifFromLevel = (totalMarks) => {};

const MediaStyle = makeStyles({
  root: {
    maxWidth: 300,
  },
  media: {
    height: 600,
  },
});

const intialState = {
  level: 1,
  progressPercentage: 0,
  baseGif: "",
  levelUpGif: "",
};

export default function MediaCard() {
  const classes = MediaStyle();

  const [totalMarks, setTotalMarks] = useState(null);
  const [pet, setPet] = useState(intialState);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:4000/marks/${userId}/total`, {
        method: "GET",
      }).then((response) => {
        response.json().then((result) =>{
          setTotalMarks(result);
        });
      });
    }
  }, []);

  useEffect(() => {
    const newLevel = resolveLevelFromMarks(totalMarks);
    const newState = {
      level: newLevel,
      progressPercentage: resolveProgressFromMarks(totalMarks, newLevel),
      baseGif: resolveBaseGifFromLevel(newLevel),
      levelUpGif: resolveLevelUpGifFromLevel(newLevel),
    };
    setPet(newState);
  }, [totalMarks]);

  return (
    <Card className="card" variant="outlined">
      <CardActionArea>
        <CardMedia className={classes.media} image={pet.baseGif} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Pirat
          </Typography>

          <LinearWithValueLabel value={pet.progressPercentage}/>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
