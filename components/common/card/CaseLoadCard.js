import React, {useEffect} from 'react';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import moment from 'moment';
import Truncate from '@konforti/react-truncate';
import { mapper } from 'lib/mapper';
import { useImmer } from 'use-immer';
import { compareProp } from 'lib/library';
import { useDidUpdateEffect } from 'lib/utils';

const CaseLoadCard = React.memo(function CaseLoadCard(props) {
  const {
    onClick = () => { },
    type = "", info = {}, 
  } = props;
  const strDudate = info.dueDate && moment.unix(info.dueDate).format('YYYY-MM-DD');

  let partnerName = info.receiver;
  if (partnerName) {
    const partnerManagerName = partnerName.manager;
    const partnerCompanyName = partnerName.company;
    partnerName = partnerManagerName
      ? `${partnerCompanyName} (${partnerManagerName})`
      : partnerCompanyName;
  }

  const checkValueDash = val => val ? val : '-';

  const handleClick = () => {
    onClick && onClick(info.id);
  }

  const handleInnerClick = config => {
    onClick && onClick(config.target.value);
  }

  return (
    <Styled.CaseLoadCard>
      <Grid container justify="space-between" onClick={handleClick}>
          <Grid item xs={1} className="list__box_item td column1">
            <span className="list__box_tx tx">
              <FormControlLabel
                className="radio_select"
                onClick={handleInnerClick}
                value={info.id}
                color="primary"
                name="partnersItem"
                control={<Radio color="primary" size="small" />}
              />
            </span>
          </Grid>

          <Grid item xs={2} className="list__box_item td column2">
            <span className="list__box_tx tx">
              {props.labelText}
            </span>
          </Grid>
          <Grid item xs={2} className="list__box_item td column3">
            <span className="list__box_tx tx">
              <span>
                <Truncate lines={2} ellipsis="...">
                  {checkValueDash(info.patient)}
                </Truncate>
              </span>
            </span>
          </Grid>
          <Grid item xs={2} className="list__box_item td column4">
            <span className="list__box_tx tx">
              <Truncate lines={2} ellipsis="...">
                {checkValueDash(info.sender && info.sender.company)}
              </Truncate>
            </span>
          </Grid>
          <Grid item xs={2} className="list__box_item td column5">
            <span className="list__box_tx tx">
              <Truncate lines={2} ellipsis="...">
                {checkValueDash(partnerName)}
              </Truncate>
            </span>
          </Grid>
          <Grid item xs={3} className="list__box_item td column6">
            <span className="list__box_tx tx">
              <Truncate lines={2} ellipsis="...">
                {checkValueDash(strDudate)}
              </Truncate>
            </span>
          </Grid>
        </Grid>
    </Styled.CaseLoadCard>
  );
}, (nextProp, prevProp) => {
  return compareProp(nextProp, prevProp, ['type', 'info', 'labelText', 'labelColor', 'onClick'])
});

const Styled = {
  CaseLoadCard: styled.div`
    border-bottom: 1px solid #E2E7EA;
    &:hover {
      background-color: #E7F4FB;
    }

    .list__box_item{
      text-align: center;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      
      &.column1 {
        flex-basis: 4.6%;
        max-width: 4.6%;
      }
      &.column2 {
        flex-basis: 13.7%;
        max-width: 13.7%;
      }
      &.column3 {
        flex-basis: 22.9%;
        max-width: 22.9%;
      }
      &.column4 {
        flex-basis: 22.9%;
        max-width: 22.9%;
      }
      &.column5 {
        flex-basis: 22.9%;
        max-width: 22.9%;
      }
      &.column6 {
        flex-basis: 13%;
        max-width: 13%;
      }

      .list__box_tx {
        font-size: 14px;
        color: #555;

        .MuiFormControlLabel-root {
          margin: 0;
        }
      }

    }    
    .list__box_item + .list__box_item {
      border-left: 1px solid #E2E7EA;
    }
  `,
}

export default CaseLoadCard;