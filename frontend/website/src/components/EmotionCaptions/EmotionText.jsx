import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

import { determineColor } from "src/utils/emotions";
import { roundDecimal2 } from "src/utils/utils";

const useStyles = makeStyles((theme) => ({
  hoverUnderline: {
    "&:hover": {
      textDecoration: "underline #000000",
    },
  },
}));

const EmotionText = ({ sentences, emotion, emotionObj }) => {
  const classes = useStyles();

  const findEmotion = (tones) => {
    return tones.find(({ tone_id }) => tone_id === emotion);
  };

  return (
    <Typography variant="body1" gutterBottom>
      {sentences.map(({ tones, text }, i) => {
        let score = 0;
        const emotionFound = findEmotion(tones);
        if (emotionFound != null) score = emotionFound.score;

        const [backgroundColor, textColor] = determineColor(
          emotionObj.color,
          score
        );

        return (
          <span key={i}>
            <Tooltip
              title={`${emotion}: ${roundDecimal2(score * 100)}%`}
              placement="top"
              interactive
            >
              <span
                className={classes.hoverUnderline}
                style={{
                  backgroundColor: backgroundColor,
                  color: textColor,
                }}
              >
                {text}
              </span>
            </Tooltip>{" "}
          </span>
        );
      })}
    </Typography>
  );
};

export default EmotionText;
