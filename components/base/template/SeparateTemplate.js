import React from 'react';
import styled from 'styled-components';


function SeparateTemplate(props) {
  const {
    navTopCont, 
    leftCont, 
    rightCont
  } = props;

  return (
    <Styled.SeparateTemplate>
      <div className="nav_top">
        {navTopCont}
      </div>
      <div className="cont">
        <div className="left_cont">
          {leftCont}
        </div>
        <div className="right_cont">
          {rightCont}
        </div>
      </div>
    </Styled.SeparateTemplate>
  );
}

const Styled = {
  SeparateTemplate: styled.div`
    .nav_top {
      display: flex;
    }

    .cont {
      display: flex;
      margin-top: 10px;

      .left_cont {
        box-shadow: 1px 1px 4px rgba(36, 47, 53, 0.2);
        flex-basis: calc(32.3% - 5px);
        min-width: calc(32.3% - 5px);
        padding: 20px 30px;
        background-color: #fff;
      }

      .right_cont {
        padding: 10px;
        box-shadow: 1px 1px 4px rgba(36, 47, 53, 0.2);
        flex-basis: calc(67.7% - 5px);
        min-width: calc(67.7% - 5px);
        margin-left: 10px;
        background-color: #fff;
      }
    }
  `,
}

export default SeparateTemplate;