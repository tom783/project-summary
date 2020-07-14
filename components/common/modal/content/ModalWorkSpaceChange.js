import React from 'react';
import styled from 'styled-components';
import {useImmer} from 'use-immer';
import { buttonBlue } from 'styles/__utils';

const initState = {
  workSpace: '',
};

function ModalWorkSpaceChange(props) {
  const {
    handleClick
  } = props;
  const [value, setValue] = useImmer(initState);

  const onChange = e => {
    const event = e.target.value;
    setValue(draft => {
      draft.workSpace = event;
    });
  }

  return (
    <Styled.WorkSpace>
      <h2>Workspace 변경하기</h2>
      <div className="works_cont">
        <input
          className="works_input"
          value={value.workSpace}
          placeholder="workspace 경로를 넣으세요."
          onChange={onChange}
          />
        <button 
          className="change_btn" 
          onClick={() => handleClick({type: 'updateWorkSpace'})(value.workSpace)}
        >
          Change
        </button>
      </div>  
    </Styled.WorkSpace>
  );
}

const Styled = {
  WorkSpace: styled.div`
    padding: 30px 55px 30px;

    h2{
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
    .works_cont{
      margin-top: 30px;
      
      .works_input{
        display: block;
        height: 30px;
        width: 250px;
        padding: 0 10px;
        font-size: 16px;
      }
    }

    .change_btn{
      display: block;
      width: 100px;
      margin: 0 auto;
      margin-top: 27px;
      ${buttonBlue};
      box-shadow:none;  
      &:hover{
        box-shadow:none;
      }
      cursor: pointer;
    }
  `,
}

export default ModalWorkSpaceChange;