import React, { useCallback } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { color, font, dotdotdot } from 'styles/__utils';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { PlainTooltip } from 'components/common/tooltip';

import {mapper} from 'lib/mapper';

const {HANDLEEVENTTYPE} = mapper;

/**
 * onClick
 * id
  company
  address
  type
 * @param {*} props 
 */
function PartnersListItem(props) {
  const { option, isModal } = props;
  const handleClick = () => {
    props.onClick && props.onClick({ ...props, key: props.id })
  }

  // radio 클릭 관리
  const handleInnerClick = useCallback(e => {
    // e.stopPropagation();
    props.onClick && props.onClick({ ...props, key: props.id, selectOption: 'onlySelect' })
  }, []);

  // 파트너 타입 객체 가공
  const partnerTypeArr = Object.keys(props.type);
  const partnerType = partnerTypeArr.length ?
    partnerTypeArr.filter(i => props.type[i])
      .map(i => {
        if (i === 'clinic') {
          return '클리닉';
        } else if (i === 'milling') {
          return 'Milling';
        } else if (i === 'lab') {
          return '기공소';
        }
      }).join(', ')
    : '-';

  const innerModal = () => {
      // onlyselect가 없을 때 modal도 같이 발생
      if(props.selectOption !=='onlySelect'){
      props.handleModal && props.handleModal({type: HANDLEEVENTTYPE.modalGetInfo, value: props.id});
    }
  }

  let listCont = '';
  if(isModal){
    listCont = <>
      <Grid container justify="space-between">
          <Grid item xs={1} className="list__box_item td column1">
            <span className="list__box_tx tx">
              <FormControlLabel
                className="radio_select"
                onClick={handleInnerClick}
                value={props.id}
                color="primary"
                name="partnersItem"
                control={<Radio color="primary" size="small" />}
              />
            </span>
          </Grid>

          <Grid item xs={3} className="list__box_item td column2">
            <span className="list__box_tx tx">
  {option === 'my' ? (props.baseLabel ? <><span className="baseLabel"></span>{props.userCode}</> : props.userCode) : props.code}
            </span>
          </Grid>
          <Grid item xs={4} className="list__box_item td column3">
            <span className="list__box_tx tx">
              <span>
                {option === 'my' ? props.companyName : props.company}
                {
                  `(${props.manager})`
                }
              </span>
            </span>
          </Grid>
          <Grid item xs={2} className="list__box_item td column4">
            <span className="list__box_tx tx">
               {props.name}
            </span>
          </Grid>
          <Grid item xs={2} className="list__box_item td column6">
            <span className="list__box_tx tx">
              {partnerType}
            </span>
          </Grid>
        </Grid>
    </>
  }else{
    listCont = <>
      <Grid container justify="space-between">
          <Grid item xs={1} className="list__box_item td column1">
            <span className="list__box_tx tx">
              <FormControlLabel
                className="radio_select"
                onClick={handleInnerClick}
                value={props.id}
                color="primary"
                name="partnersItem"
                control={<Radio color="primary" size="small" />}
              />
            </span>
          </Grid>

          <Grid item xs={1} className="list__box_item td column2">
            <span className="list__box_tx tx">
  {option === 'my' ? (props.baseLabel ? <><span className="baseLabel">기본</span>{props.userCode}</> : props.userCode) : props.code}
            </span>
          </Grid>
          <Grid item xs={3} className="list__box_item td column3">
            <span className="list__box_tx tx">
              <span>
                {option === 'my' ? props.companyName : props.company}
                {
                  `(${props.manager})`
                }
              </span>
            </span>
          </Grid>
          <Grid item xs={1} className="list__box_item td column4">
            <span className="list__box_tx tx">
               {props.name}
            </span>
          </Grid>
          <Grid item xs={4} className="list__box_item td column5">
            <span className="list__box_tx tx">
              <PlainTooltip
                title={props.address}
                placement="bottom"
                isActive={true}
                interactive={false}
              >
                <span>
                  {props.address}
                </span>
              </PlainTooltip>
            </span>
          </Grid>
          <Grid item xs={1} className="list__box_item td column6">
            <span className="list__box_tx tx">
              {partnerType}
            </span>
          </Grid>
          <Grid item xs={1} className="list__box_item td column6">
            <span className="list__box_tx tx">
              <button className="list__detail_btn" onClick={innerModal}>VIEW</button>
            </span>
          </Grid>
        </Grid>
    </>
  }

  return (
    <Styled.PartnersListItem isModal={isModal}>
      <div className="list__row" onClick={handleClick}>
        {listCont}
      </div>
    </Styled.PartnersListItem>
  )
}

const Styled = {
  PartnersListItem: styled.div`
    .list__row{
      border-bottom:1px solid ${color.gray_border2};
      cursor: pointer;

      &:hover{
        background:${color.blue_week_hover};
      }
    }
    .list__box_item{
      &.column1 {
        max-width: ${props => props.isModal? '8.3%' : '3.6%'};
        flex-basis: ${props => props.isModal? '8.3%' : '3.6%'};
      }

      &.column2 {
        max-width: ${props => props.isModal? '25%' : '12.8%'};
        flex-basis: ${props => props.isModal? '25%' : '12.8%'};
      }

      &.column3 {
        max-width: ${props => props.isModal? '33.3%' : '21.3%'};
        flex-basis: ${props => props.isModal? '33.3%' : '21.3%'};
      }

      &.column4 {
        max-width: ${props => props.isModal? '16.7%' : '10.6%'};
        flex-basis: ${props => props.isModal? '16.7%' : '10.6%'};
      }

      &.column5 {
        max-width: 37.5%;
        flex-basis: 37.5%;
      }

      &.column6 {
        max-width: ${props => props.isModal? '16.7%' : '7.1%'};
        flex-basis: ${props => props.isModal? '16.7%' : '7.1%'};
      }
    }
    .list__box_tx{
      .baseLabel {
        margin-right: 3px;
        font-size: 12px;
        color: #fff;
        font-weight: 600;
        background-color: #00A6E2;
        border-radius: ${props => props.isModal? '50%' : '20px'};
        width: ${props => props.isModal? '12px' : '40px'};
        height: ${props => props.isModal? '12px' : '20px'};     
        padding: 0 8px;
      }

      & .radio_select{
        margin: 0;
      }
      &.tx{
        padding:0 5px;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        ${font(14, color.black_font)};
        ${dotdotdot};
        width:100%;
        line-height: 30px;
      }
      &.bold{
        font-weight:600;
      }
      & .tooltip__wapper{
        vertical-align: middle;
      }

      & p{
        ${dotdotdot};
        white-space: pre-line;
        line-height: 1.3;
      }

      .list__detail_btn {
        height: 26px;
        line-height: 26px;
        background-color: #00A6E2;
        border: none;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        padding: 0 9px;
        cursor: pointer;
      }
    }
    .MuiRadio-colorPrimary.Mui-checked{
      color: ${color.blue};
    }
  `
}

export default PartnersListItem;
