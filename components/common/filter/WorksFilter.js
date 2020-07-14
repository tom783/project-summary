import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { useImmer } from 'use-immer';
import styled from 'styled-components';
import { font, color, buttonBlue, buttonWhite } from 'styles/__utils';
import cx from 'classnames';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { ENV_MODE_DEV } from 'lib/setting';
import _ from 'lodash';

import {mapper} from 'lib/mapper';

const {WORKSSEARCHTYPE} = mapper;

const WorksPopContentState = {
  filter: {},
}
function WorksPopContent(props) {
  const { 
    onClose,
    getFilterValue, 
    initFilterState,
    handleSumbit,
  } = props;
  const [values, setValues] = useImmer(WorksPopContentState);

  const filterTopStatusList = WORKSSEARCHTYPE.filter.filterTopStatusList;
  const filterTypeBtnList = WORKSSEARCHTYPE.filter.filterTypeBtnList;
  const filterSortBtnList = WORKSSEARCHTYPE.filter.filterSortBtnList;

  const handleChange = config => {
    const { type, value } = config;
    console.log(config);
    setValues(draft => {
      if (type !== 'hidden') {
        const targetStateList = values.filter[type];
        const new_list = targetStateList.indexOf(value) === -1
          ? _.union([...targetStateList], [value])
          : _.filter(targetStateList, item => item !== value)
        draft.filter[type] = new_list
      } else {
        draft.filter.hidden = value;
      }
    })
  }

  const handleClick = config => {
    console.log(values.filter);
    const {type} = config;
    if(type === 'apply'){
      console.log("submit");
      handleSumbit();
      onClose();
    }
  }

  useEffect(() => {
    setValues(draft => {
      draft.filter = initFilterState;
    });
  }, []);

  useEffect(() => {
    getFilterValue(values.filter);
  }, [values.filter]);
  
  const checkBoxisCheck = (type, checkItem) => {
    let isCheck = false;
    if(!!values.filter[type]){
      if(values.filter[type].indexOf(checkItem) !== -1){
        isCheck = true;
      }else{
        isCheck = false;
      }
    }
    return isCheck;
  }

  return (
    <Styled.WorksPopContent>
      <div className="filter__rows">
        <h3 className="filter__title top">Status</h3>
        <div className="filter__body">
          {filterTopStatusList.map((item, idx) => {
            const isCheck = checkBoxisCheck('stage', item.id);
            return (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      color="primary"
                      onChange={() => handleChange({ type: "stage", value: item.id })}
                      checked={isCheck}
                    />
                  }
                  label={item.text}
                />
            )
          })}
        </div>
      </div>
      <div className="filter__rows">
        <h3 className="filter__title">Status</h3>
        <div className="filter__body">
          {filterTypeBtnList.map((item, idx) => {
            const isCheck = checkBoxisCheck('type', item.id);
            return (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      color="primary"
                      onChange={() => handleChange({ type: "type", value: item.id })}
                      checked={isCheck}
                    />
                  }
                  label={item.text}
                />
            )
          })}
        </div>
      </div>
      <div className="filter__rows">
        <h3 className="filter__title">Status</h3>
        <div className="filter__body hidden__option">
          <RadioGroup aria-label="gender" name="gender1" value={+values.filter.hidden}
            onChange={(e) => handleChange({ type: "hidden", value: e.target.value })}
          >
            {filterSortBtnList.map((item, idx) => {
              return (
                  <FormControlLabel
                    value={item.id}
                    key={idx}
                    control={
                      <Radio
                        // value={item.id}
                        color="primary"
                      // onChange={() => handleChange({ type: "hidden", value: item.id })}
                      // checked={!!values.type.clinic}
                      />
                    }
                    label={item.text}
                  />
              )
            })}
          </RadioGroup>
        </div>
      </div>
      <div className="filter__rows ">
        <div className="btn__box">
          <button className="close__btn" onClick={onClose}>Cancel</button>
          <button className="apply__btn" onClick={() => {
            if (ENV_MODE_DEV) {
              handleClick({ type: "apply" })
            } else {
              alert('Coming soon.')
            }
          }}>Apply</button>
        </div>
      </div>
    </Styled.WorksPopContent>
  )
}


const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

const PopoverState = {

}

export default function SimplePopover(props) {
  const classes = useStyles();
  const [values, setValues] = useImmer(PopoverState);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    content, 
    popover,
    className, 
    getFilterValue, 
    initFilterState,
    handleSumbit,
  } = props;

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Styled.SimplePopover>
        <button
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          className={cx("filter__btn", className)}
        >
          {content}
        </button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {popover || <WorksPopContent onClose={handleClose} getFilterValue={getFilterValue} initFilterState={initFilterState} handleSumbit={handleSumbit} />}
        </Popover>
      </Styled.SimplePopover>
    </>
  );
}

const Styled = {
  WorksPopContent: styled.div`
    &{
      width:338px;
      padding:20px;
      padding-top: 30px;

      .filter__title{
        ${font(14, color.black_font)};
        font-weight:bold;
        border-bottom:1px solid ${color.gray_border6};
        padding-bottom:5px;
        margin-bottom:5px;
        margin-top:30px;
        &.top{
          margin-top:0;
        }
      }

      .filter__body {
        display: flex;
        flex-flow: row wrap;
        padding-left: 5px;
      }

      .close__btn{
        position: relative;
        left:-5px;
        margin-right:10px;
        width: 70px;
        height: 26px;
        font-size: 14px;
        color: #00A6E2;
        background-color: #fff;
        border: 1px solid #00A6E2;
        cursor: pointer;
      }

      .apply__btn{
        width: 70px;
        height: 26px;
        font-size: 14px;
        color: #fff;
        background-color: #00A6E2;
        border: 1px solid #00A6E2;
        cursor: pointer;
      }

      .btn__box{
        text-align:center;
        margin-top:40px;
      }

      .MuiIconButton-root{
        padding:0;
        width: 16px;
        height: 16px;
      }

      .MuiCheckbox-colorPrimary.Mui-checked, .MuiRadio-colorPrimary.Mui-checked{
        color:${color.blue};
      }

      .MuiTypography-body1 {
        ${font(14, '#555')};
        margin-left: 6px;
      }

      .MuiFormControlLabel-root {
        margin-left: 0;
        margin-right: 0;
      }

      .MuiFormControlLabel-root + .MuiFormControlLabel-root {
        margin-left: 15px;
      }

      .MuiFormControlLabel-root:nth-of-type(3n-2) {
        margin-left: 0;
      }

      .hidden__option {
        .MuiFormControlLabel-root:nth-of-type(1) {
          flex-basis: 100%;
        }
        .MuiFormControlLabel-root:nth-of-type(2) {
          margin-left: 0;
        }

        .MuiFormControlLabel-root:nth-of-type(n+2) {
          margin-top: 17px;
        }
      }

      .MuiFormControlLabel-root:nth-of-type(n+4) {
        margin-top: 17px;
      }

      .MuiFormGroup-root {
        flex-direction: row;
      }
    }
  `,
  SimplePopover: styled.span`
    .filter__btn{
      cursor: pointer;
    }
  `
}