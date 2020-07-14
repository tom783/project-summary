import React from 'react';
import {DashboardTemplate} from 'components/base/template';
import {AlertContainer} from 'containers/alert';
import {NavContainer} from 'containers/nav';

function AlertList(props) {

  return (
    <DashboardTemplate
      nav={<NavContainer type="dashboard" />}
      rightSpace={<NavContainer type="executor" />}
    >
      <AlertContainer />
    </DashboardTemplate>
  );
}

export default AlertList;