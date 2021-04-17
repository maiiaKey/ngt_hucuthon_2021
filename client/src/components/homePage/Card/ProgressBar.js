import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function LinearProgressWithLabel({ value }) {
  return (
    <Box display="flex" alignItems="center" className="progressWrapper">
        <Typography className="progressPercent" variant="body2" color="textSecondary">{`${Math.round(
          value
        )}%`}</Typography>
        <LinearProgress className="progressBar" variant="determinate" value={value} />
      </Box>
  );
}

export default function LinearWithValueLabel({ value }) {
  return <LinearProgressWithLabel value={51} />;
}
