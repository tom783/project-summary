import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { font, color } from 'styles/__utils';
import CachedIcon from '@material-ui/icons/Cached';
import cx from 'classnames';
import { useImmer } from 'use-immer';
import { useSelector } from 'react-redux';
import { storage } from 'lib/library';
import _ from 'lodash';
import { mapper } from 'lib/mapper';
import { WorksFilter } from 'components/common/filter';
import { ENV_MODE_DEV } from 'lib/setting';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import {CommonSearch} from 'components/common/search';
import {
  icon_filter,
  icon_search,
  icon_arrow_under
} from 'components/base/images';

// import {useDidUpdateEffect} from 'lib/utils';
// import { useDidUpdateEffect } from 'lib/utils';
const {WORKSSEARCHTYPE: {search: searchMapper}} = mapper;

let initialState = {
  search: {
    sort: searchMapper.base.id,
    type: "",
    search: "",
    first: true,
    isLoad: false,
    filter: {
      stage: [],
      type: [],
      hidden: mapper.WORKSSEARCHTYPE.filter.filterSortBtnList[0].id
    },
  },
  refresh: {
    active: false
  },
  toggle: {
    sortOption: false,
  }
}


function WorksSearch(props) {
  const [values, setValues] = useImmer(initialState);
  const typeSelectRef = useRef(null);
  const { onSearch, onClick, type } = props;
  const { listing: listingReducer, auth: authReducer } = useSelector(state => state);
  const userCode = authReducer.signIn.profile.userCode;
  const getStorageCurrenctCode = storage.get('worksCurrentCode');
  const isTypeSender = getStorageCurrenctCode && getStorageCurrenctCode.currentSenderCode === userCode
  const isCompleteCard = listingReducer.works.currentCardStage === 5;
  const searchValue = values.search;
  const rListingSearch = listingReducer.works.search;

  const handleSumbit = _.debounce(config => {
    onSearch && onSearch({ ...values.search, first: true })
  }, 200)


  const handleClick = _.debounce(config => {
    const { type } = config;
    if (type === 'refresh') {
      setValues(draft => {
        draft.refresh.active = true;
      });
    }
    onClick && onClick({ type, value: values.search });
  }, 200);


  // filter에서 값을 받아온다
  const getFilterValue = value => {
    if(value){
      setValues(draft => {
        draft.search.filter = value;
      });
    }
  }

  // search에서 값을 받아온다
  const getSearchValue = value => {
    if(value){
      setValues(draft => {
        draft.search.sort = value.sort;
        draft.search.search = value.search;
      });
    }
  }

  // NOTE: listing search 하는데 Redux에 search 데이터 있을때 내부 스테이트 업데이트,
  useEffect(() => {
    // useDidUpdateEffect(()=>
    setValues(draft => {
      draft.refresh.active = false;
      draft.search.search = rListingSearch.search;
    });
  }, [rListingSearch]);

  useEffect(() => {
    if (typeSelectRef.current === document.activeElement) {
      onSearch && onSearch(values.search);
    }
  }, [values.search.type]);


  const deleteAble = isTypeSender && !isCompleteCard;
  return (
    <Styled.WorksSearch>
      <div className="WorksSearch__row">
        <div className="WorksSearch__button_box">
          <button 
            className="sort_refresh_btn" 
            onClick={() => onClick({type: 'refresh'})}
          >
              <CachedIcon style={{ fontSize: 30 }} />
          </button>
          <button
            className="WorksSearch__btn delete"
            onClick={(e) => handleClick({ type: "delete", e })}
          >
            DELETE
          </button>
        </div>


        <div className="WorksSearch__search_box">
          <WorksFilter
            className="WorksSearch__filter_btn"
            content="Filter"
            getFilterValue={getFilterValue}
            initFilterState={values.search.filter}
            handleSumbit={handleSumbit}
          />
          
          <div className="WorksSearch__search">
            <CommonSearch 
            onSearch={()=> onSearch(values.search)}
            getSearchValue={getSearchValue}
            mapper={searchMapper}
            />
          </div>
        </div>
      </div>

    </Styled.WorksSearch>
  );
}


const Styled = {
  WorksSearch: styled.div`
  &  {
    .WorksSearch__row {
      position: relative;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .WorksSearch__button_box {
      display: flex;
      padding-left: 3%;

      .sort_refresh_btn {
        cursor: pointer;
        color: ${color.blue};
        border: none;
        background-color: transparent;
      }

      .WorksSearch__btn {
        text-transform: uppercase;
        padding: 10px 8px;
        background: ${color.blue};
        ${font(18, color.white)};
        font-weight: 600;
        border-radius: 1px;
        border: none;
        cursor: pointer;
        transition: all .2s;
        line-height: 20px;

        &:hover {
          background: ${color.blue_hover};
        }
        &.isShow {
          visibility:visible;
        }
        &.delete {
          width: 90px;
          text-transform: none;
          vertical-align: bottom;
        }
      }

    }
    

    .WorksSearch__search_box {
      display: flex;
      width: 34%;
      &{
        .WorksSearch__filter_btn {
          position: relative;
          padding: 16px 0;
          height: 50px;
          border: 1px solid #777;
          border-radius: 1px;
          background-color: #fff;
          ${font(16, "#777")};
          line-height: 16px;
          padding-left: 32px;
          padding-right: 48px;

          &::before,
          &::after {
            content:'';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
          &::before {
            left: 9px;
            width: 18px;
            height: 18px;
            background: url(${icon_filter}) no-repeat center;
            background-size: contain;
          }
          &::after {
            right: 10px;
            width: 8px;
            height: 13px;
            background: url(${icon_arrow_under}) no-repeat center;
            background-size: contain;
          }
        }

        .WorkSearch__input_box {
          position: relative;
          display: inline-block;
          height: 50px;
          border: 1px solid #777;
          margin-left: 5px;

          &{
            .WorkSearch__input_sort_btn {
              position: relative;
              display: inline-block;
              width: 80px;
              height: 100%;
              border: none;
              background-color: #fff;
              cursor: pointer;
              ${font(16, "#777")};
              padding: 17px 15px;
              padding-right: 32px;
              vertical-align: bottom;
              line-height: 14px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: left;

              &::after {
                content: '';
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                width: 8px;
                height: 13px;
                background: url(${icon_arrow_under}) no-repeat center;
                background-size: contain;
              }
            }

            .WorksSearch__input {
              position: relative;
              display: inline-block;
              height: 100%;
              border: none;
              padding-left: 15px;
              ${font(16, "#777")};

              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                height: 30px;
                width: 1px;
                background-color: #777;
              }
            }

            .WorksSearch__search_btn {
              text-indent: -9999px;
              display: inline-block;
              width: 40px;
              height: 40px;
              background: url(${icon_search}) no-repeat center #00A6E2;
              background-size: 18px;
              border: none;
              margin-right: 5px;
              cursor: pointer;
            }
          }
        }

        .WorkSearch__input_sort_option{
          position: absolute;
          left: 0;
          bottom: -1px;
          transform: translateY(100%);
          background-color: #fff;
          width: 100%;
          margin-top: 1px;
          z-index: 99;
          border: 1px solid #E2E7EA;
          padding: 15px 20px;
          transition: all 0.3s ease-out;
          &.show {
            opacity: 1;
            visibility: visible;
          }

          &.hidden {
            opacity: 0;
            visibility: hidden;
          }
        }

        .WorksSearch__search {
          width: 76%;
        }

      }

    }
  }
  `
}

export default WorksSearch;


{/* {isTypeSender &&
  <button 
  className={cx("WorksSearch__btn", "delete")} 
  onClick={(e)=>handleClick({type:"delete",e})}>DELETE</button>
} */}


// useEffect(() => {
  // const defaultConfig = {
  //   sort: +searchValue.sort,
  //   search: searchValue.search,
  //   type: searchValue.type,
  //   first: true
  // };

  // if(!listingReducer.works.search.isLoad){
  //   // onSearch && onSearch(defaultConfig);
  // }
// }, []);
