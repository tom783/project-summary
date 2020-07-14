import React, { useEffect } from 'react';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import styled from 'styled-components';
import moment from 'moment';
import Truncate from '@konforti/react-truncate';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { mapper } from 'lib/mapper';
import { useImmer } from 'use-immer';
import { compareProp } from 'lib/library';
import { useDidUpdateEffect } from 'lib/utils';

import { 
  font, 
  color 
} from 'styles/__utils';

import {
  icon_edit,
  icon_hidden,
  icon_load,
} from 'components/base/images';

/**
 * 
 * checked
 * onClick
 * info={
 *  caseId
    patient
    sender
    receiver
    dueDate
 * } 
 * @param {*} props object
 */

const {HANDLEEVENTTYPE} = mapper;
const WorksCardState = {
  key: false,
  checked: false,
  expanded: false
}

const WorksCard = React.memo(function WorksCard(props) {
  const {
    onClick = () => { },
    type = "", info = {}, 
    checked = false, 
    checkEventId=[], 
    handleCheck = () => {}, 
    listKey=''
  } = props;
  const [values, setValues] = useImmer(WorksCardState);
  const isListCard = type === 'list';
  const strDudate = info.dueDate && moment.unix(info.dueDate).format('YYYY-MM-DD');

  // NOTE: works click event
  /**
   * 
   * @param {object} config 
   */
  const handleLink = config => {
    const { type } = config;
    onClick && onClick({ ...info, type: HANDLEEVENTTYPE.link });
  }

  const handleHidden = e => {
    e.stopPropagation();
    onClick && onClick({caseCode: info.caseCode, type: HANDLEEVENTTYPE.workHidden})
  }

  // NOTE: checked update
  useDidUpdateEffect(() => {
    setValues(draft => {
      draft.checked = checked;
    });
  }, [checked]);

  // NOTE: init
  useEffect(() => {
    setValues(draft => {
      draft.checked = checked;
    });
  }, []);


  let partnerName = info.receiver;
  if (partnerName) {
    const partnerManagerName = partnerName.manager;
    const partnerCompanyName = partnerName.company;
    partnerName = partnerManagerName
      ? `${partnerCompanyName} (${partnerManagerName})`
      : partnerCompanyName;
  }

  let isChecked = false;
  checkEventId.forEach(i => {
    if(info.caseCode === i.caseCode){
      isChecked = true;
    }
  });

  return (
    <Styled.WorksCard labelText={props.labelText} labelColor={props.labelColor} onClick={() => { }}>
      <Grid container className="WorksCard__row" spacing={0}>
        <Grid item xs={1} className="WorksCard__check">
          <Checkbox
            value={info.caseCode}
            className="WorksCard__check_box"
            checked={!!isChecked}
            onClick={handleCheck({type: HANDLEEVENTTYPE.singleSelect, key: listKey})}
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
        </Grid>
        <Grid item xs={11} className={cx("WorksCard__list_row", { "list": isListCard })} onClick={handleLink}>
          <Grid container className={cx("WorksCard__list_con_box")}>
            <Grid item xs={1} className="WorksCard__table info_state">
              <div className="WorksCard__list_state">
                {props.labelText}
              </div>
            </Grid>
            <Grid item xs={3} className="WorksCard__table info_table">
              <h6 className="WorksCard__title">Pateint</h6>
              <div className={cx("WorksCard__contents", { "list": isListCard })}>
                <Truncate lines={2} ellipsis="...">
                  {checkValueDash(info.patient)}
                </Truncate>
              </div>
            </Grid>
            <Grid item xs={3} className="WorksCard__table info_table">
              <h6 className="WorksCard__title">{mapper.sender}</h6>
              <div className={cx("WorksCard__contents", { "list": isListCard })}>
                <Truncate lines={2} ellipsis="...">
                  {checkValueDash(info.sender && info.sender.company)}
                </Truncate>
              </div>
            </Grid>
            <Grid item xs={3} className="WorksCard__table info_table">
              <h6 className="WorksCard__title">{mapper.receiver}</h6>
              <div className={cx("WorksCard__contents", { "list": isListCard })}>
                <Truncate lines={2} ellipsis="...">
                  {checkValueDash(partnerName)}
                </Truncate>
              </div>
            </Grid>
            <Grid item xs={1} className="WorksCard__table date_table">
              <h6 className="WorksCard__title">Due Date</h6>
              <div className={cx("WorksCard__contents", { "list": isListCard })}>
                <Truncate lines={2} ellipsis="...">
                  {checkValueDash(strDudate)}
                </Truncate>
              </div>
            </Grid>
            <Grid item xs={1} className="WorksCard__table button_gnb">
              <button className="button__load">load</button>
              <button className="button__hidden" onClick={handleHidden}>hidden</button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Styled.WorksCard>
  );
}, (nextProp, prevProp) => {
  return compareProp(nextProp, prevProp, ['type', 'info', 'checked', 'checkEventId', 'listKey'])
});
const checkValueDash = val => val ? val : '-';

const Styled = {
  WorksCard: styled.div`
  width:100%;
  & {
    .MuiFormControlLabel-root{
      margin:0;
      }
      .WorksCard__row,.MuiGrid-grid-xs-1{
        position: relative;
        
      }
      .MuiRadio-colorPrimary.Mui-checked{
        color:${color.blue};
      }
      .WorksCard__check_box{
        position: relative;
        top: 50%;
        left: 10px;
        padding: 0;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
      }

      .MuiGrid-grid-xs-1{
        max-width: 3%;
        flex-basis: 3%;
      }
      .WorksCard__list_row {
        max-width: 97%;
        flex-basis: 97%;
      }
      .MuiCheckbox-colorPrimary.Mui-checked{
        color:red;
      }

      .WorksCard__list_row{
        position: relative;
        ${font(16, color.black_font)};
        border: 1px solid ${color.gray_border6};
        border-radius: 5px;
        background: ${color.white};
        padding: 21px 0;
        padding-left: 25px;
        padding-right: 30px;
        transition: all .3s;
        cursor: pointer;
        z-index: 1;
        &.list{
          margin-bottom:5px;
          padding:25px 0px 10px 0;
        }

        &:hover{
          border: 1px solid ${color.blue};
          box-shadow: 0px 0px 5px 2px ${color.blue_week}; 
        }
      }
      .WorksCard__table{
        padding-left: 30px;

        &.button_gnb{
          max-width: 9%;
          flex-basis: 9%;
          display: flex;
          align-items: center;

          & > button {
            border: none;
            width: 25px;
            height: 25px;
            text-indent: -9999px;
            cursor: pointer;
            border-radius: 50%;
          }

          button + button {
            margin-left: 10px;
          }

          .button__edit {
            background: url(${icon_edit}) no-repeat center #AFBFC9;
          }

          .button__load {
            background: url(${icon_load}) no-repeat center #AFBFC9;
          }
          .button__hidden {
            background: url(${icon_hidden}) no-repeat center #AFBFC9;
          }

        }
        & > svg{
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
        }
        /* padding-top: 10px; */

        &.info_state {
          max-width: 6.7%;
          flex-basis: 6.7%;
          padding-left: 0;
          display: flex;
          align-items: center;
        }

        &.info_table{
          max-width: 24.6%;
          flex-basis: 24.6%;
        }
        &.date_table{
          max-width: 7.6%;
          flex-basis: 7.6%;
        }
      }
    .WorksCard__list_state {
      ${font(13, color.white)};
      background-color: ${props => props.labelColor};
      border-radius: 30px;
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;

    }

    .WorksCard__contents{
      ${font(14, color.black_font)};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      line-height:1;
      &.list{
        ${font(14)};
      }
    }

    .WorksCard__title{
      ${font(12, color.gray_text)};
      line-height: 1;
      margin-bottom: 10px;
    }
  }

  /* @media screen and (max-width: 1920px) {
    & {
        .WorksCard__check_box{
          left: 0.52vw;
          width: 1.04vw;
          height: 1.04vw;
        }

        .WorksCard__list_row{
          font-size: 0.83vw;
          padding: 1.09vw 0;
          padding-left: 1.30vw;
          padding-right: 1.56vw;
          &.list{
            margin-bottom:0.26vw;
            padding:1.30vw 0px 0.52vw 0;
          }
        }

        .WorksCard__table{
          padding-left: 1.56vw;

          &.button_gnb{
            & > button {
              width: 1.30vw;
              height: 1.30vw;
            }

            button + button {
              margin-left: 0.52vw;
            }
          }
        }
      .WorksCard__list_state {
        font-size: 0.68vw;
        width: 5.21vw;
        height: 1.56vw;
        line-height: 1.56vw;
      }

      .WorksCard__contents{
        font-size: 0.73vw;
        &.list{
          font-size: 0.73vw;
        }
      }

      .WorksCard__title{
        font-size: 0.63vw;
        margin-bottom: 0.52vw;
      }
    }
  } */
  
  
`
}


export default WorksCard;



{/* <Grid item xs={3} className="WorksCard__table">
  <h6 className="WorksCard__title">Case ID</h6>
  <div className={cx("WorksCard__contents", { "list": isListCard })}>{checkValueDash(info.caseId)}</div>
</Grid> */}