import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import styled from 'styled-components';
import _ from 'lodash';

import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import {
  icon_search,
  icon_arrow_under
} from 'components/base/images';
import { font, color } from 'styles/__utils';


/**
 * 
 * onSearch // function // 검색 함수
 * getSearchValue // function // 상위 부모 컴포넌트에 input 값 전달받을 함수
 * mapper // object // search type을 정의한 mapper 객체
 */
function CommonSearch(props) {
  const {
    onSearch,
    getSearchValue,
    mapper,
  } = props;

  const initState = {
    search: {
      sort: mapper.base.id,
      search: "",
    },
    toggle: {
      sortOption: false
    }
  }

  const [values, setValues] = useImmer(initState);
  const searchValue = values.search;


  // sort option 영역 토글
  const handleToggle = config => {
    const {type, isShow} = config;
    if(isShow !== undefined){
      setValues(draft => {
        draft.toggle.sortOption = isShow;
      })
    }else{
      if(type === 'showToggle'){
        setValues(draft => {
          draft.toggle.sortOption = !values.toggle.sortOption;
        });
      }

    }
  }

  const handleKeyUp = config => {
    const { e } = config;
    if (e.key === 'Enter') {
      onSearch && onSearch();
    }
  };

  const handleSumbit = _.debounce(config => {
    onSearch && onSearch();
  }, 200);

  const handleChange = config => {
    const { e, type } = config;
    const targetValue = e.target.value;
    const typeList = ['sort', 'search'];
    setValues(draft => {
      draft.toggle.sortOption = false;
    });
    
    if (typeList.indexOf(type) !== -1) {
      setValues(draft => {
        draft.search[type] = targetValue;
      });
    }
  }

  useEffect(() => {
    getSearchValue(values.search);
  }, [values.search]);

  // sort button text 매핑 부분
  let sortType = mapper.base.text;
  Object.keys(mapper).forEach(i => {
    if(values.search.sort === mapper[i].id){
      sortType = mapper[i].text;
    }
  });

  const radioItem = Object.keys(mapper).map((i, idx) => {
    return (
      <FormControlLabel
          key={idx}
          value={mapper[i].id}
          control={<Radio color="primary" size="small" />}
          label={
            <span className="signup__input public text">{mapper[i].text}</span>
          }
          labelPlacement="end"
        />
    );
  });
  
  return (
    <Styled.CommonSearch>
      <button
        className="WorkSearch__input_sort_btn"
        onClick={e => handleToggle({type: "showToggle", e})}
        onBlur={e => handleToggle({isShow: false})}
      >
        {sortType}
      </button>
      <input
        type="text"
        className="WorksSearch__input"
        placeholder="Search"
        value={searchValue.search}
        onKeyUp={(e) => handleKeyUp({ type: "search", e })}
        onChange={(e) => handleChange({ type: "search", e })}
      />
      <button
        className="WorksSearch__search_btn"
        onClick={handleSumbit}
      >Seach</button>
      <div 
      className={
        `WorkSearch__input_sort_option 
        ${values.toggle.sortOption? 'show': 'hidden'}`
      }
      >
        <RadioGroup
          aria-label="position"
          name="position"
          value={searchValue.sort}
          onChange={(e) => handleChange({ type: 'sort', e })}
        >
          {radioItem}
        </RadioGroup>
      </div>
    </Styled.CommonSearch>
  );
}

const Styled = {
  CommonSearch: styled.div`
    position: relative;
    width: 100%;
    height: 50px;
    border: 1px solid #777;
    margin-left: 5px;
    z-index: 999;
    display: flex;
    align-items: center;

    &{
      .WorkSearch__input_sort_btn {
        position: relative;
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
        flex-basis: 25%;
        max-width: 25%;

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
        height: 100%;
        border: none;
        padding-left: 15px;
        ${font(16, "#777")};
        flex-basis: calc(75% - 40px);
        max-width: calc(75% - 40px);

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

    .WorkSearch__input_sort_option{
          position: absolute;
          left: 0;
          bottom: -1px;
          transform: translateY(100%);
          background-color: #fff;
          width: 100%;
          margin-top: 1px;
          z-index: 999;
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

      }

  `,
}

export default CommonSearch;