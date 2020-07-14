import React from 'react';
import styled from 'styled-components';
import { color, font, dotdotdot } from 'styles/__utils';
import { CaseLoadCard } from 'components/common/card';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useImmer } from 'use-immer';
import moment from 'moment';
import {DateConverter} from 'components/base/helpers/convert';
import {convertDateTime} from 'lib/library';
import {useSelector} from 'react-redux';
import Grid from '@material-ui/core/Grid';

function CaseLoadList(props) {
  const { list,onChange } = props;
  const [values, setValues] = useImmer({
    radioCheckedValue: "",
  });
  const {radioCheckedValue} = values;
  const {listing:listingReducer} = useSelector(state=>state);
  
  // const handleChange = prop => e => {
  //   console.log('change');
  //   const inputType = (prop === 'remember' || prop === 'auto') ? 'checked' : 'value';
  //   const targetValue = e.target[inputType];
  //   setValues(draft => {
  //     draft[prop] = targetValue;
  //   });
  // };

  const handleClick= (config) =>{
    if(config){
      onChange && onChange(config);
      setValues(draft=>{
        draft.radioCheckedValue = config;
      });
    }
  }
  return (
    <Stlyed.CaseLoadList>
      <div className="list__control">
        <div className="list__box_title">
          <Grid container justify="space-between" >
            <Grid item xs={1} className="list__box_item th column1">
              <span className="list__box_tx tx bold">선택</span>
            </Grid>
            <Grid item xs={2} className="list__box_item th column2">
              <span className="list__box_tx tx bold">상태</span>
            </Grid>
            <Grid item xs={2} className="list__box_item th column3">
              <span className="list__box_tx tx bold">Patient</span>
            </Grid>
            <Grid item xs={2} className="list__box_item th column4">
              <span className="list__box_tx tx bold">Owner</span>
            </Grid>
            <Grid item xs={2} className="list__box_item th column5">
              <span className="list__box_tx tx bold">Partner</span>
            </Grid>
            <Grid item xs={3} className="list__box_item th column6">
              <span className="list__box_tx tx bold">Due Date</span>
            </Grid>
          </Grid>
        </div>
        <RadioGroup 
          aria-label="position" 
          name="position" 
          value={radioCheckedValue} 
          // onChange={handleChange(`radioCheckedValue`)} 
          row>
          {Array.isArray(list) && list.map((item, idx) => {
            const lableConf = listingReducer.processType[item.stage];
            const worksCardData ={
              id:item.caseCode,
              caseId:item.caseId,
              patient:item.patient,
              sender:{
                company:item.sender
              },
              receiver:{
                company:item.receiver
              },
              dueDate:item.dueDate,
              strDueDate:convertDateTime({type:"date",value:item.dueDate}),

            };

            return (
              <div key={idx} className="caseload__con">
                <CaseLoadCard 
                  type="list"
                  labelText={lableConf.title} 
                  labelColor={lableConf.color} 
                  info={worksCardData}
                  onClick={handleClick}
                />
              </div>
            )
          })}
        </RadioGroup>
      </div>
    </Stlyed.CaseLoadList>
  );
}

const Stlyed = {
  CaseLoadList: styled.div`
    .list__control {
      position: relative;
    }
    .list__box_title {
      position: sticky;
      top: 0;
      left: 0;
      overflow:hidden;
      z-index: 99;
      background-color: #F4F4F4;
      border-bottom: 1px solid #E2E7EA;

      .list__box_item {
        position:relative;
        height:50px;
        text-align:center;
        &.th{
          height: 36px;
        }
        &:last-child{
          border-right:0;
        }

        &.column1 {
          flex-basis: 4.6%;
          max-width: 4.6%;
        }
        &.column2 {
          flex-basis: 13.7%;
          max-width: 13.7%;
        }
        &.column3 {
          flex-basis: 22.9%;
          max-width: 22.9%;
        }
        &.column4 {
          flex-basis: 22.9%;
          max-width: 22.9%;
        }
        &.column5 {
          flex-basis: 22.9%;
          max-width: 22.9%;
        }
        &.column6 {
          flex-basis: 13%;
          max-width: 13%;
        }

        .list__box_tx {
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
        }
      }

      .list__box_item + .list__box_item {
        border-left:1px solid ${color.gray_border6};
      }
    }

    .caseload__con{
      cursor: pointer;
      width:100%;
      &:hover{
        .caseload__box{
          background:rgba(0,0,0,.1);
        }
      }
    }
    .caseload__subtitle{
      ${font(14, color.black_font)};
      margin-bottom:5px;
    }
    .caseload__box{
      padding:13px;
      border-radius:10px;
      border:1px solid ${color.gray_border6};
      ${font(14, color.black_font)};
    }
  `
}

export default CaseLoadList;