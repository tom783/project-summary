import React, {useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import { color, font } from 'styles/__utils';

import {FullScreenLoading} from 'components/base/loading';
import {MypageInfo, Mypartners} from 'components/common/info';
import {OptionContainer} from 'containers/mypage';
import {mapper} from 'lib/mapper';

const {HANDLEEVENTTYPE} = mapper;

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    
    flexGrow: 1,
    '& .MuiTabs-indicator': {
      display: 'none'
    },
  },
  tabbar: {
    backgroundColor: 'transparent',
    color: `${color.gray_text}`,
    boxShadow: 'none',
    width: '480px',
    transform: 'translateY(1px)',
    position: 'relative',
    zIndex: '10',
    top: '0',
  },
  tabitem: {
    font:`${font(16)}`,
    fontSize: '16px',
    backgroundColor: `${color.white}`,
    border: '1px solid #E2E7EA',
    borderRadius: '10px 10px 0 0',
    letterSpacing: 'normal',
    textTransform: 'none',

    '&.Mui-selected': {
      borderBottom: 'none',
      color: '#00A6E2',
      zIndex: '10',
    },
  },
  tabpanel: {
    font:`${font(16)}`,
    fontSize: '16px',
    color: `${color.black_font}`,
    position: 'relative',
    border: '1px solid #E2E7EA',
    borderRadius: '0 10px 10px 10px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '2px 2px 5px rgba(36, 53, 51, 0.2)',
    minHeight: '921px',
    
  }
}));


export default function TabBar(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const {
    initData,
    pending,
    countryData,
    cityData,
    handleClick,
    userCode,
    openModal,
    routeHistory,
    matchUrl,
    changeControlModify
  } = props;

  // tab change func
  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
    if(newValue){
      // tab 이동시 modify를 비활성화
      changeControlModify({isView: false});
    }
  },[]);

  const loadingStyleConf = {
    position: 'absolute',
    backgroundColor: 'white'
  }
  
// 각 탭에 해당하는 route history 추가
/**
 * value: int
 */
  const routeHistoryTab = value => {
    if(value === 0){
      return routeHistory('');
    }else if(value === 1){
      return routeHistory('partner');
    }else if(value === 2){
      return routeHistory('option');
    }
  }

  useEffect(() => {
    if(matchUrl === '/mypage/'){
      setValue(0);
    }else if(matchUrl === '/mypage/partner'){
      setValue(1);
    }else if(matchUrl === '/mypage/option'){
      setValue(2);
    }
  }, [matchUrl]);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.tabbar}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab className={classes.tabitem} label="Information" {...a11yProps(0)} />
          <Tab className={classes.tabitem} label="Partners" {...a11yProps(1)} />
          <Tab className={classes.tabitem} label="Option" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      {/* url path: /mypage/ */}
      <TabPanel className={classes.tabpanel} value={value} index={0}>
        {pending.getInfoResult && <FullScreenLoading styleConf={loadingStyleConf} />}
        <MypageInfo
         initData={initData.myinfo}
         isViewModify={initData.isViewModify}
         countryData={countryData}
         cityData={cityData}
         userCode={userCode}
         handleClick={handleClick}
         openModal={openModal}
         routeHistory={() => routeHistoryTab(value)}
         changeControlModify={changeControlModify}
         />
      </TabPanel>
      {/* url path: /mypage/mypartner */}
      <TabPanel className={classes.tabpanel} value={value} index={1}>
        {pending.getPartnerResult && <FullScreenLoading styleConf={loadingStyleConf} />}
        <Mypartners
          handleClick={handleClick}
          routeHistory={() => routeHistoryTab(value)}
        />
      </TabPanel>
      {/* url path: /mypage/option */}
      <TabPanel className={classes.tabpanel} value={value} index={2}>
        <OptionContainer 
          handleClick={handleClick}
          routeHistory={() => routeHistoryTab(value)}
        />
      </TabPanel>
    </div>
  );
}
