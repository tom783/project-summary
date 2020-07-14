import React from 'react';
import styled from 'styled-components';
import { color, font } from 'styles/__utils';
import { CaseLoadList } from 'components/common/listing';
import { useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import { Toastify } from 'components/common/toastify';
import { InfiniteScroll } from 'components/base/scroll';
import {CaseLoadSearch} from 'components/common/search';
import {
  LISTING_CASE_LOAD,
  LISTING_CASE_LOAD_SAGAS,
  LISTING_WORKS_SEARCH_SAGAS
} from 'store/actions';

// import {LoadingCircle} from 'components/base/loading'
// import { Scrollbars } from 'react-custom-scrollbars';

function CaseLoadListForm(props) {
  const { onSubmit, onCancle } = props;
  const { listing: listingReducer, auth: authReducer } = useSelector(state => state);
  const { case: caseList } = listingReducer;
  const userCode = authReducer.signIn.profile.userCode;

  const [values, setValues] = useImmer({
    result: null,
    isNotSelected: false,
    errorCount: 0
  });

  // NOTE: click event
  const handleClick = value => config => {
    if (value === 'list') {
      setValues(draft => {
        draft.result = config;
        draft.isNotSelected = false;
      });
    }
    if (value === 'load') {
      if (!values.result) {
        setValues(draft => {
          draft.isNotSelected = false;
        });
        setValues(draft => {
          draft.isNotSelected = true;
        });
      } else {
        onSubmit && onSubmit(values.result)
      }
    }
  };

  const onSearch = config => {
    const searchConfig = {
      userCode: userCode,
      page: 1,
      sort: config.sort,
      search: config.search,
      type: config.type,
      first: config.first,
      filter: {
        stage: config.filter.stage,
        type: config.filter.type,
        hidden: config.filter.hidden
      },
    };
    LISTING_WORKS_SEARCH_SAGAS(searchConfig);
  }

  const loadConfig = {
    userCode: authReducer.signIn.profile.userCode,
    page: caseList.page
  }
  const isEnd = caseList.isEnd;

  return (
    <Stlyed.CaseLoadListForm>
      <div className="caseLoad__toastify_box">
        <Toastify
          type="info"
          show={values.isNotSelected}
          text="Please, select case."
        />
      </div>

      <h1 className="caseload__title">Load Case</h1>
      <div>
        <CaseLoadSearch 
          onSearch={onSearch}
        />
      </div>
      <div className="caseload__con_box">
        <InfiniteScroll
          isEnd={isEnd}
          maxDataLength={30}
          dataLength={caseList.load.length}
          next={() => LISTING_CASE_LOAD_SAGAS(loadConfig)}
          unMount={() => LISTING_CASE_LOAD.init()}
          height={386}
        >
          <CaseLoadList
            list={caseList.load}
            onChange={handleClick('list')}
          />
        </InfiniteScroll>
        
      </div>
      <div className="caseload__button_box">
        <button
          onClick={onCancle}
          className="caseload__button caseload__button-white"
        >CANCEL</button>
        <button
          onClick={handleClick('load')}
          className="caseload__button caseload__button-blue"
        >LOAD</button>
      </div>
    </Stlyed.CaseLoadListForm>
  );
}

const Stlyed = {
  CaseLoadListForm: styled.div`
    padding:40px;
    .cassload__info{
      ${font(14)};
    }
    .MuiGrid-grid-xs-1 {
      max-width: 7%;
      flex-basis: 7%;
    }
    .caseload__con_box{
      /* max-height:425px; */
      /* overflow-y:auto; */
      /* padding-right:30px; */
      border-bottom: 1px solid #E2E7EA;
    }
    .caseload__title{
      text-align:center;
      ${font(22, color.black_font)};
      margin-bottom:20px;
      font-weight: 600;
    }
    .caseload__button_box{
      background:white;
      text-align:center;
      padding-top:15px;
    }
    .caseload__button{
      ${font(16)};
      width: 100px;
      height: 34px;
      box-shadow:none;
      cursor: pointer;

      &-blue{
        border:none;
        margin-left: 5px;
        background:${color.blue};
        color:white;
        transition: all .3s;
        &:hover{
          background:${color.blue_hover};
          box-shadow:none;
        }
      }
      &-white{
        border:1px solid ${color.blue};
        background:white;
        color:${color.blue};
        &:hover{
          background:white;
          box-shadow:none;
        }
      }
    }
    .align__center{
      text-align:center;
    }
    .caseLoad__toastify_box{
      ${font(14)};
      text-align:center;
      .Toastify__toast{
        background: white;
        color: black;
        box-shadow: 5px 5px 5px rgba(0,0,0,.2);
        border-radius:5px;
      }
      .Toastify__close-button{
        color:black;
      }

    }
  `
}

export default CaseLoadListForm;