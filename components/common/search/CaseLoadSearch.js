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


function CaseLoadSearch(props) {
  const [values, setValues] = useImmer(initialState);
  const typeSelectRef = useRef(null);
  const { onSearch} = props;
  const { listing: listingReducer, auth: authReducer } = useSelector(state => state);
  const userCode = authReducer.signIn.profile.userCode;
  const getStorageCurrenctCode = storage.get('worksCurrentCode');
  const isTypeSender = getStorageCurrenctCode && getStorageCurrenctCode.currentSenderCode === userCode
  const isCompleteCard = listingReducer.works.currentCardStage === 5;
  const searchValue = values.search;
  const rListingSearch = listingReducer.works.search;

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
    <Styled.CaseLoadSearch>
      <div className="CaseLoadSearch__row">
        <div className="CaseLoadSearch__search_box">
          <CommonSearch 
            onSearch={()=> onSearch(values.search)}
            getSearchValue={getSearchValue}
            mapper={searchMapper}
          />
        </div>
      </div>

    </Styled.CaseLoadSearch>
  );
}


const Styled = {
  CaseLoadSearch: styled.div`
  &  {
    .CaseLoadSearch__row {
      position: relative;
      margin-bottom: 10px;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }

    .CaseLoadSearch__search_box {
      display: flex;
      width: 57%;
    }
  }
  `
}

export default CaseLoadSearch;


