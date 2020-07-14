import React from 'react';
import {DashboardTemplate} from 'components/base/template';
import {CaseContainer} from 'containers/case';
import {NavContainer} from 'containers/nav';

function Case(props) {
  return (
    <DashboardTemplate
      nav={<NavContainer type="dashboard" />}
      rightSpace={<NavContainer type="executor" />}
      styleConf="background-color: transparent; box-shadow: none; overflow: visible"
    >
      <CaseContainer />
    </DashboardTemplate>
  );
}

export default Case;