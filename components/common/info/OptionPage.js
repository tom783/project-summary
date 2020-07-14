import React, {useEffect} from 'react';
import { useImmer } from 'use-immer';
import { useTranslation } from "react-i18next";
import {Actions} from 'store/actionCreators';

import styled from 'styled-components';
import { buttonBlue } from 'styles/__utils';
import { font, color } from 'styles/__utils';
import { makeStyles } from '@material-ui/core/styles';
import CachedIcon from '@material-ui/icons/Cached';
import {T} from 'components/base/text'; //국제화 모듈 컴포넌트
import {mapper} from 'lib/mapper';

import CustomDatePicker from 'components/common/input/CustomDatePicker';

const {HANDLEEVENTTYPE} = mapper;

const initState = {
  language: {
    id: '',
    i18nType: '',
  },
};

function OptionPage(props) {
  const {
    workSpace,
    syncTime,
    syncPending,
    rLanguage
  } = props;
  const [values, setValues] = useImmer(initState);
  const {
    language,
  } = values;

  const {
    handleClick
  } = props;
  const typeList = [
    {
      id: '1',
      title: 'Korea',
      i18nType: 'ko',
    },
    {
      id: '2',
      title: 'English',
      i18nType: 'en',
    }
  ];

  // <T.Text>
  //   hello //key
  // </T.Text>
  const {t: i18nTxt} = useTranslation(); //다국어 변환
  
  const OptionItem = Array.isArray(typeList) && typeList.map((i, index) => {
    return <option key={index} value={i.id} >{i.title}</option>
  });

  const handleChange = e => {
    const selectOption = e.target.value;
    
    setValues(draft => {
      draft.language.id = selectOption;
      draft.language.i18nType = typeList[selectOption-1].i18nType;
    });
  };

  const clickChangeLang = () => {
    Actions.base_language_change(values.language.i18nType);
  }

  useEffect(() => {
    let setLaguageId = '';
    if(rLanguage === 'ko'){
      setLaguageId = '1';
    }else if(rLanguage === 'en'){
      setLaguageId = '2';
    }

    setValues(draft => {
      draft.language.id = setLaguageId;
      draft.language.i18nType = rLanguage;
    });
  },[]);

  return (
    <Styled.OptionWrap>
      <div className="optionRow">
        <span className="label">
          Workspace
        </span>
          <div className="cont">
            <div className="path">
            {workSpace}
            </div>
          </div>
        
          <button
            className="option__btn folderBtn"
            onClick={handleClick({type: HANDLEEVENTTYPE.workspaceModal})}
          >
            Change
          </button>
      </div>
      <div className="optionRow">
        <span className="label">
          Language
        </span>
        <div className="cont">
          <select 
            id="language" 
            value={language.id}
            onChange={handleChange}
          >
            {
              OptionItem
            }
          </select>
        </div>
        <button
          onClick={clickChangeLang}
          className="option__btn folderBtn"
          >OK</button>
      </div>
      <div className="optionRow">
        <span className="label">
          Synchronization
        </span>
        <div className="cont">
          {syncTime}
          <CachedIcon className={`syncImg ${syncPending ? 'active' : ''}`} style={{ fontSize: 30 }} />
        </div>
        <button 
          className="option__btn folderBtn"
          onClick={handleClick({type: 'sync'})}
        >
          Sync
        </button>
      </div>
    </Styled.OptionWrap>
  );
}

const useStyles = makeStyles(theme => ({
  formControl: {
    width: `100%`,
    
  },
}));

const Styled = {
  OptionWrap : styled.div`
    padding: 16px;
  
    & .optionRow{
      height: 32px;
      margin-bottom: 20px;

      & .label{
        display: inline-block;
        width: 150px;
        font-weight: 700;
      }

      & .cont{
        display: inline-block;
        margin-left: 10px;
        width: 200px;
        color: ${color.gray_font};
        

        .syncImg{
          color: ${color.blue};
          width: 25px;
          height: 25px;
          vertical-align: top;
          margin-left: 10px;
          transition: all .2s;

          &.active{
            animation: 3s rotate infinite linear;
          }
          @keyframes rotate{
            from {transform: rotate(0)}
            to{transform: rotate(-360deg)}
          }
        }

        & select{
          padding: 6px 62px 6px 10px;
          font-size: 14px;

          & option{
            height: 100%;
          }
        }
      }

      & .folderBtn{
        display: inline-block;
        text-align: center;
        width: 80px;
        cursor: pointer;

    /* &.optionRow + .optionRow{
      margin-top: 25px;
    } */

    &.option__btn{
      ${buttonBlue};
      background: ${color.btn_color};
      padding: 0;
      box-shadow:none;
      margin-left: 60px;
      height: 100%;
      &:hover{
        box-shadow:none;
        background: ${color.btn_color_hover};
      }
    }
      }
    }


  `,
}

export default OptionPage;