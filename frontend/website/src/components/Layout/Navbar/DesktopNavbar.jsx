import React from "react";
import { Link } from "gatsby";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  navButton: {
    color: "white",
  },
  title: {
    flexGrow: 1,
  },
}));

const DesktopNavbar = ({ buttons, links }) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <div className={classes.title} />
        {buttons.map((button, index) => (
          <Link to={links[index]} key={index}>
            <Button color="default" className={classes.navButton}>
              {button}
            </Button>
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default DesktopNavbar;