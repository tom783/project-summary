import React,{useEffect} from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { useImmer } from 'use-immer';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { color, font } from 'styles/__utils';
import {CommonSearch} from 'components/common/search';

import {mapper} from 'lib/mapper';

const {HANDLEEVENTTYPE, PARTNERSEARCHTYPE: {search: searchMapper}} = mapper;

const initState = {
  searchKeyword: "",
  searchSelectedType: ""
};

function PartnersSearch(props) {
  const classes = useStyles();
  const [values, setValues] = useImmer(initState);
  const {
    searchSelectedType,
    searchKeyword,
  } = values;


  // 검색 조건 및 검색 클릭 이벤트 관리
  const handleClick = config => e => {
    const {type} = config;
    if (type === HANDLEEVENTTYPE.selected) {
      const targetValue = e.target.value;
      setValues(draft => {
        draft.searchSelectedType = targetValue;
      });
    }
    if(type === HANDLEEVENTTYPE.search){
      const result = {
        keyword: searchKeyword,
        selectedType:searchSelectedType
      }
      props.onSubmit && props.onSubmit(result);
    }
  };

  const getSearchValue = value => {
    setValues(draft => {
      draft.searchKeyword = value.search;
      draft.searchSelectedType = value.sort;
    });
  }

  return (
    <Styled.PartnersSearch>
       <Grid container justify="space-between" spacing={1}>
          <Grid item xs={12}>
            <CommonSearch 
              onSearch={handleClick({type: HANDLEEVENTTYPE.search})}
              getSearchValue={getSearchValue}
              mapper={searchMapper}
            />
          </Grid>
        </Grid>
    </Styled.PartnersSearch>
  );
}



const useStyles = makeStyles(theme => ({
  formControl: {
    width: `100%`
  },
}));

const Styled ={
  PartnersSearch:styled.div`
  width: 100%;

  .partnerss__btn {
    width: 100%;
    top: -1px;
  }
  .MuiInputBase-input {
      height: 38px;
      font-size: 14px;
    }

  .MuiInputBase-input.Mui-focused fieldset {
    border: 2px solid ${color.blue};
  }

  .Mui-focused .MuiOutlinedInput-notchedOutline{
      border-color:${color.blue} !important;
    }
  
  .MuiGrid-spacing-xs-1 {
    margin: 0;
    width: 100%;
  }

  .MuiGrid-spacing-xs-1 > .MuiGrid-item{
    padding: 0;
    padding-left: 5px;
  }
  `
}

export default PartnersSearch;