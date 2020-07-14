import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { color, font, buttonBlue, dotdotdot } from 'styles/__utils';
import RadioGroup from '@material-ui/core/RadioGroup';
import {PartnersListItem} from 'components/common/card';

import {mapper} from 'lib/mapper';

const {HANDLEEVENTTYPE} = mapper;


/**
 * onClick
 * list,info 
 * @param {*} props 
 */
function PartnersList(props) {
  let {
    list,
    info,
    typeList,
    option,
    selectOption,
    pCode,
    isModal
  } = props;
  
  // list 선택 관리
  /**
   * config: {"type" : string}
   */
  const handleClick = useCallback(config => e => {
    const {type} = config;
    if (type === HANDLEEVENTTYPE.selected) {
      const result={
        component:HANDLEEVENTTYPE.PartnersList,
        value:e.key
      }
      Object.assign(result,config,e);
      props.onClick && props.onClick(result);
    }
  },[]);

  // my partner list default partner sorting
  if(option === 'my'){
    if(list.length){
      //props로 받아온 list는 type에러가 발생하기 때문에 복사해올 array를 만들어준다.
      let partnerList = [];
      list.forEach(element => {
        partnerList.push(element);
      });

      let _index = 0;
      let prevList = [];

      // 내 파트너 리스트에서 디폴트 리스트 위로 정렬 및 (기본) 붙여주기
      partnerList.forEach((i, index) => {
        if(i.info.userCode === pCode){
          _index = index;
          prevList = partnerList.splice(_index, 1);
          partnerList.splice(0, 0, prevList[0]);
          partnerList[0] = {
            info:{
              ...partnerList[0].info,
              baseLabel: true
            },
          }
        }
      });
      
      list = partnerList;
    }
  }

  let titleDiv = "";
  if(isModal){
    titleDiv = <>
      <Grid container justify="space-between" >
        <Grid item xs={1} className="list__box_item th column1">
          <span className="list__box_tx tx bold">선택</span>
        </Grid>
        <Grid item xs={3} className="list__box_item th column2">
          <span className="list__box_tx tx bold">고유번호</span>
        </Grid>
        <Grid item xs={4} className="list__box_item th column3">
          <span className="list__box_tx tx bold">업체명</span>
        </Grid>
        <Grid item xs={2} className="list__box_item th column4">
          <span className="list__box_tx tx bold">이름</span>
        </Grid>
        <Grid item xs={2} className="list__box_item th column6">
          <span className="list__box_tx tx bold">타입</span>
        </Grid>
      </Grid>
    </>
  }else{
    titleDiv = <>
      <Grid container justify="space-between" >
        <Grid item xs={1} className="list__box_item th column1">
          <span className="list__box_tx tx bold">선택</span>
        </Grid>
        <Grid item xs={1} className="list__box_item th column2">
          <span className="list__box_tx tx bold">고유번호</span>
        </Grid>
        <Grid item xs={3} className="list__box_item th column3">
          <span className="list__box_tx tx bold">업체명</span>
        </Grid>
        <Grid item xs={1} className="list__box_item th column4">
          <span className="list__box_tx tx bold">이름</span>
        </Grid>
        <Grid item xs={4} className="list__box_item th column5">
          <span className="list__box_tx tx bold">주소</span>
        </Grid>
        <Grid item xs={1} className="list__box_item th column6">
          <span className="list__box_tx tx bold">타입</span>
        </Grid>
        <Grid item xs={1} className="list__box_item th column6">
          <span className="list__box_tx tx bold">업체 정보</span>
        </Grid>
      </Grid>
    </>
  }

  return (
    <Styled.PartnersList isModal={isModal}>
      
        <div className="list__control">
          <div className="list__box_title">
            {titleDiv}
          </div>

          <RadioGroup value={info.value ? info.value : "0"} >
            <div className="list__box">
              {list.map((item, idx) => (
                <PartnersListItem 
                  key={idx} 
                  id={option === 'my'? item.info.userCode : item.info.code} 
                  typeList={typeList} 
                  {...item.info} 
                  option={option}
                  handleModal={props.handleModal}
                  selectOption={selectOption}
                  onClick={handleClick({ type: HANDLEEVENTTYPE.selected})} 
                  isModal={isModal}
                />
              ))}
            </div>
          </RadioGroup>
        </div>
    </Styled.PartnersList>
  );
}

const Styled = {
  PartnersList: styled.div`
    .list__control .MuiFormGroup-root{
      flex-wrap:nowrap;
    }
    .list__control{
      position: relative;
      /* height:400px;
      overflow:auto; */

      .list__box_title{
        position: sticky;
        top: 0;
        left: 0;
        overflow:hidden;
        z-index: 99;
      }
    }
    .partnerss__btn{
      ${buttonBlue};
      box-shadow:none;
      &:hover{
        box-shadow:none;
      }
    }
    .list__box_tx{
      &.tx{
        padding:0 5px;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        ${font(14, color.black_font)};
        ${dotdotdot};
        width:100%;
      }
      &.bold{
        font-weight:600;
      }
    }
    .list__box_item{
      position:relative;
      height:50px;
      border-right:1px solid ${color.gray_border6};
      text-align:center;
      &.th{
        height: 40px;
      }
      &:last-child{
        border-right:0;
      }

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
    .MuiRadio-colorPrimary.Mui-checked{
      color: ${color.blue};
    }
  `
}

export default PartnersList;