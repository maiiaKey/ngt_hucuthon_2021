import React from "react";
import { Card, TextField } from "@material-ui/core";
import "./Card.css";

export default function MediaCard() {
  
    return (
        <Card className="card">
            <TextField
                fullWidth
                id="input email"
                label="Pet name"
                variant="outlined"
                type="text"
            />
        </Card>
    );
  }