import React from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import _ from 'lodash';
import { color, font } from 'styles/__utils';
import { DashboardNavProfile } from 'components/common/nav';
import { device } from 'styles/__utils';
import { NavLink } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { withRouter } from 'react-router-dom';
import { 
  LISTING_WORKS_SEARCH_SAGAS, 
  MESSAGE_LIST_SAGAS 
} from 'store/actions';

import {
  icon_case_teeth,
  icon_mypage_person,
  icon_works_box,
  icon_alert_big,
  icon_dash_board
} from 'components/base/images';
const menuList = [
  {
    id: 0,
    title: 'Home',
    icon: icon_case_teeth,
    link: '/home',
    hidden: true
  },
  // {
  //   id: 1,
  //   title: 'DashBoard',
  //   icon: icon_dash_board,
  //   link: '/dashBoard',
  //   hidden: false
  // },
  {
    id: 2,
    title: 'Case',
    icon: icon_case_teeth,
    link: '/case',
    hidden: false
  },
  {
    id: 3,
    title: 'Works',
    icon: icon_works_box,
    link: '/works/1',
    hidden: false
  },
  {
    id: 4,
    title: 'Notification',
    icon: icon_alert_big,
    link: '/alert/list/1',
    hidden: false
  },
  {
    id: 5,
    title: 'My Page',
    icon: icon_mypage_person,
    link: '/mypage',
    hidden: false
  },
];

const cutUrl = str => str.substr(1).split('/')[0];

function DashboardNav(props) {
  const [navList] = useImmer(menuList);
  const { profile, info, auth } = props;
  const isGhostCustomer = auth.signIn.grade === 3;
  const userCode = auth.signIn.profile.userCode;

  // NOTE: nav menu click event
  const handleClick = _.throttle(config => {
    const { type } = config;
    const isTypeWorks = type === '/works/1';
    if (props.match.url !== type) LISTING_WORKS_SEARCH_SAGAS.init();
    if (isTypeWorks) {
      const isPageWorks = cutUrl(props.location.pathname) === 'works';
      if (isPageWorks) {
        const searchConfig = {
          userCode: userCode,
          page: 1,
          sort: 1,
          search: "",
          type: "",
          first: true,
          filter: {
            stage: [],
            type: [],
            hidden: 0
          },
        };
        LISTING_WORKS_SEARCH_SAGAS(searchConfig);
      }
    }

    if (type === 'alertLink') {
      const messageConf = {
        page: 1,
        userCode: userCode
      }
      MESSAGE_LIST_SAGAS(messageConf);
      props.history.push(`/alert/list/1`);
    }
  }, 1000);

  return (
    <Styled.DashboardNav>
      <DashboardNavProfile
        image={profile.profile}
        title={profile.company ? profile.company : profile.name}
        email={profile.email}
        connectState={4}
        isConnect={info.isNetworkConnect}
        alert={true}
        handleClick={handleClick}
        // message={1000}
        message={info.error.message}
      />

      <div className="DashboardNav__link_con">
        {navList.map(item => {
          if ((isGhostCustomer || !true) && [1, 4, 5].indexOf(item.id) !== -1) return null;
          const isWorksPage = cutUrl(item.link) === cutUrl(props.location.pathname);
          return <div className={cx('DashboardNav__link box', { hidden: item.hidden })} key={item.id}>
            <NavLink
              to={item.link}
              exact
              className={cx("DashboardNav__link an", { active: isWorksPage })}
              onClick={() => handleClick({ type: item.link })}
            >
              <span className="DashboardNav_icon_box DashboardNav_item_box">
                <img src={item.icon} alt="nav icon" className="DashboardNav_icon" />
              </span>
              <span className="DashboardNav__text DashboardNav_item_box">{item.title}</span>
            </NavLink>
          </div>
        })}
      </div>

      <div className="DashboardNav__link box logout">
        <NavLink to="/auth/logout" className="DashboardNav__link an" >Logout</NavLink>
      </div>

    </Styled.DashboardNav>
  );
}

const Styled = {
  DashboardNav: styled.nav`
    position:relative;
    width:220px;
    min-height:100vh;
    padding-top:50px;
    background:white;
    .DashboardNav__link{
      display:block;
      padding:0;
      &.hidden{
        display:none;
      }
      &.logout{
        position:absolute;
        bottom:30px;
        left:50%;
        transform:translateX(-50%);
        width:100px;
        border-radius:30px;
        border:2px solid ${color.blue};
        & a{
          padding:7px 15px;
          ${font(14, color.black_font)};
          font-weight:500;
          text-align: center;
        }
      }
    }
    .DashboardNav__link_con{
      margin-top:40px;
    }
    .DashboardNav__link.an{
      position: relative;
      padding:28px 44px;
      padding-right: 0;
      overflow: hidden;
      &.active{
        &:after{
          position:absolute;
          content:"";
          display:block;
          clear: both;
          right:0;
          top:0;
          width:5px;
          height:100%;
          background:${color.blue_week};
        }
        background:${color.blue_week_hover}
      }
    }
    .DashboardNav_icon_box{
      display:inline-block;
      width:24px;
      height:24px;
      margin-right:20px;
    }
    .DashboardNav_icon{
      display:inline-block;
      width:100%;
      height:100%;
    }
    .DashboardNav__text{
      position:relative;
      ${font(16, color.black_font)};
    }
    .DashboardNav_item_box{
      float:left;
    }
    @media screen and (max-width:${device.pc}){
      /* width:100vh; */
    }
  `
}

export default withRouter(DashboardNav);



  // const { listing: listReducer } = useSelector(state => state);
  // const [deClick,setDeClick] = useImmer(true);