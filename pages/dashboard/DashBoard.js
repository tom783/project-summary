import React from 'react';
import {DashboardTemplate} from 'components/base/template';
import {DashBoardContainer} from 'containers/dashboard'
import {NavContainer} from 'containers/nav';

function DashBoard(props) {
  return (
    <DashboardTemplate 
      nav={<NavContainer type="dashboard"/>} 
      title="Dash Board"
      rightSpace={<NavContainer type="executor"/>}
      styleConf={{
        padding: '0', 
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'unset'
      }}
    >
      <DashBoardContainer />
    </DashboardTemplate>
  );
}

export default DashBoard;