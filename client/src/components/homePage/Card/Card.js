import React from "react";
import { Card, TextField } from "@material-ui/core";
import "./Card.css";

import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import logo from './Parrot.gif';

import ProgressBar from "./ProgressBar"

const MediaStyle = makeStyles({
    root: {
      maxWidth: 300,
    },
    media: {
      height: 600,
    },
  });

export default function MediaCard() {
    const classes = MediaStyle();

    return (
        <Card className="card" variant="outlined">
            <CardActionArea>
            <CardMedia
                className={classes.media}
                image={logo}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                Пират
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                Че-то там
                </Typography>
            </CardContent>
            </CardActionArea>
            <ProgressBar />
            <CardActions>
  
            </CardActions>
        </Card>
    );
  }