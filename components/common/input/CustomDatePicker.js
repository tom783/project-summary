import React from 'react';
import { useImmer } from 'use-immer';
import styled from 'styled-components';
import {createGlobalStyle} from 'styled-components';
import moment from 'moment';

//ant react module
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';

const initState = {
  date: moment().unix(),
}

/**
 * @param {*} props
 * defaultValue : Date, // moment 객체
 * placeholder : string //
 * showToday : boolean // 하단에 today 버튼 여부
 * onChange : function(date, dateString) // 날짜 변경 데이터를 컨트롤할 함수
 * disabledDate : boolean, // 지난 날짜 선택 여부 
 */
function CustomDatePicker(props) {
  const [values, setValues] = useImmer(initState);
  const {
    defaultValue = null,
    placeholder = "Pick a day",
    showToday = false,
    onChange = null,
    disabledDate = true,
  } = props;

  // 내부 state에 날짜 변경을 적용. onChange함수를 안보낼때, default 기능을 위해
  const changeDate = (date, dateString) => {
    console.log("default date pick", date, dateString);
    setValues(draft => {
      draft.date = date;
    });
  }

  // 이전 날짜 계산하는 함수
  const setDisabledDate = current => {
    return current && current < moment().endOf('day');
  }

  return (
    <Styled.DatePicker>
      <DatePicker 
        {...props}
        defaultValue={defaultValue? defaultValue: values.date}
        placeholder={placeholder}
        showToday={showToday}
        onChange={onChange? onChange : changeDate}
        disabledDate={disabledDate && setDisabledDate}
      />
      <Styled.GlobalStyles />
    </Styled.DatePicker>
  );
};

const Styled = {
  DatePicker:styled.div`
  & {
    .MuiOutlinedInput-adornedEnd {
      width:100%;
    }
  }
  `,
  GlobalStyles:createGlobalStyle`
    .ant-picker-content {
      .ant-picker-cell-today,
      .ant-picker-cell-selected
       {
         .ant-picker-cell-inner{
          border-radius: 50%;
          &:before{
            border-radius: 50% !important;
          }
         }
      }
    }
  `
}

export default CustomDatePicker;