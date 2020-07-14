import React from 'react';
import styled from 'styled-components';
import { font, color } from 'styles/__utils';
import { LoadingCircle } from 'components/base/loading';
import { compareProp } from 'lib/library';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
// import { CardAndDetail } from 'components/common/info';
import {CardContainer} from 'containers/bridge';
import {mapper} from 'lib/mapper';

const {HANDLEEVENTTYPE} = mapper;

const WorksCardList = React.memo(function DaysWorksList(props) {
  const {
    list = [], 
    isPending = true, 
    onClick = () => { }, 
    handleCheck = () => {}, 
    checkEventId = {}, 
    allCheckBox ={},
  } = props;
  /** list 포맷
   * (2) [{…}, {…}]
      0: {duedate: "2020-04-08", list: Array(1)}
      1:
      duedate: "2020-04-07"
      list: Array(6)
      0: {caseCode: "20200407-d4b8c847-f513-4f4b-b023-eea42e80f761", caseId: "20200407-기공소-erh-0006", senderCode: "20Jan31-0001", receiverCode: "dlgudwns783-20MAR-0001", sender: {…}, …}
      1: {caseCode: "20200407-820f26c9-9f95-4029-8e35-5ecffe0717ab", caseId: "20200407-기공소-weg-0004", senderCode: "20Jan31-0001", receiverCode: "dlgudwns783-20MAR-0001", sender: {…}, …}
      2: {caseCode: "20200407-249fe09b-f50f-4832-9b3c-41715d6dd464", caseId: "20200407-기공소-weg-0003", senderCode: "20Jan31-0001", receiverCode: "dlgudwns783-20MAR-0001", sender: {…}, …}
      3: {caseCode: "20200407-96592d43-95f1-4742-a955-32978aeedcda", caseId: "20200407-기공소-weg-0002", senderCode: "20Jan31-0001", receiverCode: "dlgudwns783-20MAR-0001", sender: {…}, …}
      4: {caseCode: "20200407-e26cca3d-309e-4fb7-b49c-3aa3a55bcdd0", caseId: "20200407-기공소-0001", senderCode: "20Jan31-0001", receiverCode: "dlgudwns783-20MAR-0001", sender: {…}, …}
      5: {caseCode: "20200407-cb2f3d6b-a5f4-4ae8-9feb-5151e41d8873"
   */
  
  return (
    <Styled.WorksCardList>
      {list.map((item, idx) =>
        <Grid container key={idx} className="WorksCardList__row">
          <Grid item xs={12} >
            <Grid container >
              <Grid item xs={1} className="WorksCardList__check_box_wrap">
                <Checkbox
                  value={item.duedate}
                  className="WorksCard__all_check_box"
                  checked={!!allCheckBox[item.duedate]}
                  onClick={handleCheck({type: HANDLEEVENTTYPE.allSelect})}
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
              </Grid>
              <Grid item xs={11} className="WorksCardList__date">
                {item.duedate} {isPending && <LoadingCircle className="WorksCardList__loading" size={15} />}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <CardContainerList 
              item={item} 
              onClick={onClick} 
              checkEventId={checkEventId[item.duedate]}
              handleCheck={handleCheck}
            />
          </Grid>
        </Grid>
      )}
    </Styled.WorksCardList>
  )
}, (nextProp, prevProp) => compareProp(nextProp, prevProp, ['list', 'isPending', 'checkEventId', 'allCheckBox']));

// NOTE: 날짜 웍스 내부 리스트 
const CardContainerList = props => {
  const { item, onClick, checkEventId, handleCheck } = props;
  return item.list.map((in_item, in_idx) =>
    <CardContainer
      key={in_idx}
      info={in_item}
      onClick={onClick}
      checkEventId={checkEventId}
      handleCheck={handleCheck}
      listKey={item.duedate}
    />
  );
}

const Styled = {
  WorksCardList: styled.div`
  & {
      .WorksCardList__row + .WorksCardList__row {
        margin-top: 10px;
      }

      .WorksCardList__check_box_wrap {
        flex-basis: 3%;
        max-width: 3%;
      }

      .WorksCardList__date {
        padding: 12px 20px;
        ${font(16, color.black_font)};
        background: ${color.blue_line_bg};
        margin-bottom: 10px;    
        flex-basis: 97%;
        max-width: 97%;
      }
      .WorksCardList__loading{
        float:right;
        color:${color.blue_hover} ;
      } 
    }

    /* @media screen and (max-width: 1920px) {
      & {
        .WorksCardList__row + .WorksCardList__row {
          margin-top: 0.52vw;
        }
        .WorksCardList__date {
          padding: 0.63vw 1.04vw;
          font-size: 0.83vw;
        }
      }
    } */
  `
}


export default WorksCardList;










{/* <CardAndDetailList
  items={item.list}
  onClick={onClick}
/> */}
// const CardAndDetailList = React.memo(function CardAndDetailList(props) {
//   const { onClick, items } = props;
//   return (
//     <>
//       {items.map((item, idx) => {
//         return <CardAndDetail
//           key={idx}
//           info={item}
//           onClick={onClick}
//         />
//       })}
//     </>
//   )
// }, (nextProp, prevProp) => prevProp.items === nextProp.items)