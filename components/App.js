import React, { useRef } from 'react';
import Core from 'containers/base/Core';
import reset from "styled-reset";
import ListComponent from 'components/testing/ListComponent';
import IndicationComponent from 'components/common/teethModel/IndicationComponent';
import { NotFound } from 'components/base/helpers/error';
import { Switch, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { PrivateRoute, LRoute } from 'components/base/route';
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux';
import { useDidUpdateEffect } from 'lib/utils';
import { Refresh } from 'components/base/helpers/refresh';
import {mapper} from 'lib/mapper';

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import './App.css';
// import { Scrollbars } from 'react-custom-scrollbars';
import {
  Home,
  Auth,
  Case,
  Works,
  WorksDetail,
  Mypage,
  Alert,
  DashBoard
} from 'pages';

const {BRAND} = mapper;

const scrollControllerStyle = {
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  background: `#FAFAFA`
}
const scrollWrapperStyle = {
  height: `100vh`,
  width: `100%`,
  overflowY: `scroll`,
  paddingRight: '20px',
}

// DOCS: doc/Appjs.md 
function App() {
  const { base: baseReducer } = useSelector(state => state);
  const scrollbarsRef = useRef();

  useDidUpdateEffect(() => {
    const scrollReducerAction = baseReducer.scrollbars.action;
    const { name, value } = scrollReducerAction;
    const actionFn = scrollbarsRef.current[scrollReducerAction.name];
    const isNameScrollTop = name === 'scrollTop';
    const isTypeFunction = typeof actionFn === 'function';
    if (isNameScrollTop) window.scrollTo(0, value);
    if (isTypeFunction) actionFn(scrollReducerAction.value);
  }, [baseReducer.scrollbars.action]);

  return (
    <>
      {/* <Scrollbars  style={{height: `100vh` }} ref={scrollbarsRef}> */}
      <div style={scrollControllerStyle}>
        <div style={scrollWrapperStyle} ref={scrollbarsRef}>
          <Helmet>
            <title>{BRAND.logo.text}</title>
          </Helmet>
          <Stlyed.GlobalStyles />
          <Core />
          <Switch>
            <PrivateRoute exact path="/" component={Home} redirect="/case" />
            <PrivateRoute path="/home" component={Home} />
            {/* <PrivateRoute path="/dashBoard" component={DashBoard} /> */}
            <PrivateRoute path="/case" component={Case} />
            <PrivateRoute exact path="/works/detail" component={WorksDetail} />
            <PrivateRoute path="/works/:list" component={Works} />
            <PrivateRoute path="/mypage" component={Mypage} />
            <PrivateRoute path="/alert" component={Alert} />
            {/* DEBUG: TEST */}
            <PrivateRoute exact path="/listtest" component={ListComponent} />
            <PrivateRoute exact path="/teeth" component={IndicationComponent} />
            {/* DEBUG: TEST */}
            <Route path="/refresh" component={Refresh} />
            <LRoute path="/auth" component={Auth} token />
            <Route component={NotFound} />

          </Switch>
        </div>
      </div>
      {/* </Scrollbars> */}
    </>
  );
}

const Stlyed = {
  GlobalStyles: createGlobalStyle`
    ${reset};
    a{
        text-decoration:none;
        color:inherit;
    }
    *{
        box-sizing:border-box !important;
    }
    body{
        font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 14px;
    }
  `
}
export default App;


