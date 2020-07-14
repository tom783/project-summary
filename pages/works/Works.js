import React from 'react';
import { DashboardTemplate } from 'components/base/template';
import { WorkContainer } from 'containers/works';
import { NavContainer } from 'containers/nav';
import { PatientSearchContainer } from 'containers/search';

const Works = React.memo(function Works() {

  return (
      <DashboardTemplate
        nav={<NavContainer type="dashboard" />}
        rightSpace={<NavContainer type="executor" />}
        styleConf="background-color: transparent; box-shadow: none"
      >
        <PatientSearchContainer />
        <WorkContainer />
      </DashboardTemplate>
  );
})


export default Works;


