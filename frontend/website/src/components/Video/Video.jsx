import React from "react";

// TODO: make video size proportional to screen size
// TODO: add hooks for getting timestamps
const Video = ({ src }) => {
  return (
    <video width="600" height="300" controls>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
