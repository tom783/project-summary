import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { font, color } from 'styles/__utils';
import cx from 'classnames';
import moment from 'moment';

import {mapper} from 'lib/mapper';

const {
  HANDLEEVENTTYPE,
  MESSAGETYPE
} = mapper;

function AlertListItem(props) {
  const {
    data, 
    handleCheck,
    checked,
    handleClick,
  } = props;
  const {
    eventLogIdx,
    event :eventTxt,
    enrollDate,
    relateUserCode,
    caseCode,
    type: messageType,
    readState
  } = data;
  
    return (
      <Styled.AlertListItem className={readState? 'read' : ''}>
        <Grid container className="AlertListItem__list_box">
          <Grid item xs={1} className={cx("AlertListItem__list", "alert_checkbox")}>
            <Checkbox
            value={eventLogIdx}
            checked={checked[eventLogIdx] === undefined? false : checked[eventLogIdx]}
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={handleCheck({type: HANDLEEVENTTYPE.singleSelect})}
            />
          </Grid>
          <Grid item xs={1} className={cx("AlertListItem__list", "alert_date")}>
            {moment.unix(enrollDate).format('YY-MM-DD')}
          </Grid>
          <Grid item xs={10} className={cx("AlertListItem__list", "alert_con")}>
            <Grid container className={cx("AlertListItem__list_con_box")}>
              <>
                {
                  // 프로젝트 생성 이벤트 발생시 해당 works로 링크 연결
                  messageType === MESSAGETYPE.link?
                  <Grid item xs={10}
                    className={cx("AlertListItem__list_con", "alert_con_tx", "hover")}
                    onClick={handleClick({type: HANDLEEVENTTYPE.link, caseCode: caseCode})}
                  >
                    {eventTxt}
                  </Grid>
                  :
                  <Grid item xs={10}
                    className={cx("AlertListItem__list_con", "alert_con_tx")}
                  >{eventTxt}</Grid>
                }
              </>
              {
                // 파트너 요청 받을 때 허용 버튼
                messageType === MESSAGETYPE.decision?
                (!readState ? 
                <Grid item xs={2} className={cx("AlertListItem__list_con", "alert_con_btn")}>
                    <button className="alert_btn" onClick={handleClick({type: HANDLEEVENTTYPE.acceptProject, partnerCode: relateUserCode})}>Accept</button>
                    <button className="alert_btn" onClick={handleClick({type: HANDLEEVENTTYPE.denyProject, partnerCode: relateUserCode})}>Deny</button>
                </Grid>
                :
                ''
                )
                :
                ''
              }
            </Grid>
          </Grid>
        </Grid>

      </Styled.AlertListItem>
    );
  }


  const Styled = {
  AlertListItem: styled.div`
  position: relative;
  /* &.read:after{
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 2px;
    background-color: red;
  } */
  &.read .AlertListItem__list_box{
    color: #ddd;
  }

  .AlertListItem__list_box{
    display: flex;
    align-items: center;
    ${font(16, color.black_font)};
    padding: 3px 0;
    border-bottom: 1px solid ${color.gray_border6};


    /* &:first-child{
      border-top: 1px solid ${color.gray_border6};
    } */
  }
  .AlertListItem__list {

    &.alert_checkbox {
      flex-basis: 2.82%;
      max-width: 2.82%;
    }

    &.alert_date {
      ${font(16, color.gray_font)};
      flex-basis: 8.10%;
      max-width: 8.10%;
      padding-left: 28px;
    }

    &.alert_con {
      flex-basis: 89%;
      max-width: 89%;
      padding-left: 10px;
    }

    & .AlertListItem__list_con_box{
      align-items: center;
    }
  }

  .MuiCheckbox-colorPrimary.Mui-checked{
    color: ${color.blue};
  }
  
  .alert_con_tx{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .hover{
    cursor: pointer;

    a {
      display: block;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .alert_con_btn{
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .alert_btn{
      background-color: #98B8CB;
      border: none;
      ${font(15, color.white)};
      margin-left: 5px;
      width: 80px;
      height: 30px;
      cursor: pointer;
      transition: all .2s; 

    }
  }

  


  `
  }

  export default AlertListItem;