// import React from 'react';
import { withRouter } from 'react-router-dom';

function RefreshForward(props) {
  const urlName = props.location.pathname;
  let urlParse;
  const index = urlName.lastIndexOf("/");
  if (index != -1) {
    urlParse = urlName.substring(urlName.length, index)
  }
  return null;
}
export default withRouter(RefreshForward);