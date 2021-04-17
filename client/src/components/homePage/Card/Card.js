import React, { useEffect, useState } from "react";
import { Card, TextField } from "@material-ui/core";
import "./Card.css";

import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ProgressBar from "./ProgressBar";
import level_1_base from "./gifs/level_1_base.gif";

const resolveLevelFromMarks = (totalMarks) => {

}

const resolveProgressFromMarks = (totalMarks) => {
    
}

const resolveBaseGifFromLevel = (totalMarks) => {
    return level_1_base;
}

const resolveLevelUpGifFromLevel = (totalMarks) => {
    
}

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
      // fetch totalMarks from backend: url/marks/userId/total (use .then!!!)
      setTotalMarks(100);
    }
  }, []);

  useEffect(() => {
    const newLevel = resolveLevelFromMarks(totalMarks);
    const newState = {
      level: newLevel,
      progressPercentage: resolveProgressFromMarks(totalMarks),
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
            Пират
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Че-то там
          </Typography>
          <ProgressBar />
        {/* Preview */}
        {/* LevelUp button */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
