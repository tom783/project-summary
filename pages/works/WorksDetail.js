import React from 'react';
import { DashboardTemplate } from 'components/base/template';
import { NavContainer } from 'containers/nav';
import {CaseCardDetailContainer} from 'containers/detail';

const WorksDetail = React.memo(function WorksDetail() {
  return (
    <DashboardTemplate
      nav={<NavContainer type="dashboard" />}
      rightSpace={<NavContainer type="executor" />}
      styleConf="background-color: transparent; box-shadow: none; overflow: visible"
    >
      <CaseCardDetailContainer />
    </DashboardTemplate>
  );
})


export default WorksDetail;


