import React from "react";
import logo from "./logo.svg";
import errorJSON from './error.json'



export default function Error() {
  var classes = {}

  return (
      <div className={classes.logotype}>
        <img className={classes.logotypeIcon} src={logo} alt="logo" />
          {errorJSON.message}
      </div>
  );
}
