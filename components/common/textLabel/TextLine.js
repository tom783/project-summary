import React from "react";
import styled from "styled-components";
import { color, font } from "styles/__utils";

function TextLine(props) {
  const { styleConf, cont, className } = props;
  const { label, value, type } = cont;
  let renderTag = type === "txt" ? value : <img src={value} alt="" />;
  if (type === null) renderTag = null;

  return (
    <Styled.TextLine {...styleConf} className={className} >
      <span className="txtLabel">{label}</span>
      <span className="cont">{renderTag}</span>
    </Styled.TextLine>
  );
}

const Styled = {
  TextLine: styled.div`
    position: relative;
    &:after{
        content: '';
        display: block;
        clear: both;
    }
    .txtLabel{
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        margin-right: 30px;
        color: ${color.black_font};
        font-weight: bold;
    }
    .cont{
        display: inline-block;
        padding-left: 170px;
        /* color: ${props => props._color}; */
        color: ${color.gray_font};

        img{
            display: block;
            width: 100px;
            height: 100px;
            border: 1px solid ${props => props._color};
            border-radius: 10px;
        }
    }
     
    `
};

export default TextLine;
