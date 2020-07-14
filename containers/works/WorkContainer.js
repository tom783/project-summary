import React, { useEffect } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import styled from 'styled-components';
import queryString from "query-string";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { mapper } from 'lib/mapper';
import { storage } from 'lib/library';
import { Actions } from 'store/actionCreators';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NoDataSearch } from 'components/common/search';
import { ArrowPageContainer } from 'containers/pagination';
import { CustomLoadingCircle } from 'components/base/loading';
import { WorksCardList } from 'components/common/listing';
import { useImmer } from 'use-immer';
import {
  LISTING_WORKS_SEARCH_SAGAS,
  INFO_WORKS_APP_DATA_UPLOAD_SAGAS,
  INFO_CASE_COMPLETE_SAGAS,
  INFO_WORKS_DIRECT_FILE_UPLOAD,
  INFO_WORKS_CASE_UPDATE_SAGAS,
  // INFO_WORKS_CASE_UPDATE,
  COMMON_EXE_NAV_SUBMIT_SAGAS,
  INFO_WORKS_CARD_HIDE_SAGAS,
} from 'store/actions';

const {HANDLEEVENTTYPE} = mapper;

const initState = {
  checkEventId: {},
  allCheckBox: {},
}

const WorkContainer = React.memo(function WorksCardListPanel(props) {
  const [values, setValues] = useImmer(initState);
  const { authReducer, listingReducer, infoReducer } = useSelector(
    ({ auth, listing, info }) => ({
      authReducer: auth,
      listingReducer: listing,
      infoReducer: info
    }));
  const rInfoWorks                      = infoReducer.works;
  const rAuthUserCode                   = authReducer.signIn.profile.userCode;
  const rListingWorks                   = listingReducer.works;
  const rListingWorksGroupList          = rListingWorks.groupList || [];
  const rListingWorksSearch             = rListingWorks.search;
  const rListingWorksPagingData         = rListingWorks.pagingData;
  const isEndPrevPage                   = !rListingWorksPagingData.prevCheck;
  const isEndNextPage                   = !rListingWorksPagingData.nextCheck;
  const isPending                       = rInfoWorks.detail && rInfoWorks.detail.pending;
  const getUrlpage                      = props.match.params.list;
  const isGroupListLengthZero           = rListingWorksGroupList.length === 0;
  const queryLocationSearch             = props.location.search;
  const rListingWorksSuccess            = rListingWorks.success;
  const rListingWorksFailure            = rListingWorks.failure;
  const rListingWorksPending            = rListingWorks.pending;
  const isWorksListLoading              = !rListingWorksSuccess || rListingWorksFailure;
  const mapperStorageCurrentCode        = mapper.localStorage.worksCurrentCode;
  const mapperStorageCurrentOnlyChecked = mapper.localStorage.worksCurrenctOnlyChecked;
  const expanelTypeString = "typeChange";

  // NOTE: PagingContainerConfig Object
  const pagingArrowIconConfig = {
    prevPageText: <ArrowBackIosIcon
      disabled={isEndPrevPage}
      className={cx("Arrow__btn_svg", { disabled: isEndPrevPage })}
    />,
    nextPageText: <ArrowForwardIosIcon
      disabled={isEndNextPage}
      className={cx("Arrow__btn_svg", { disabled: isEndNextPage })}
    />
  };

  // NOTE: Formatting that is updated when a search event occurs and sent to the server
  const searchConfig = {
    userCode: rAuthUserCode,
    page: getUrlpage,
    sort: rListingWorksSearch.sort,
    search: rListingWorksSearch.search,
    type: rListingWorksSearch.type,
    first: false,
  }

  // NOTE: WorksList Card Click event
  /**
   * 
   * @param {object} config 
   */
  const handleClick = config => {
    // const isConfSenderCode = config.senderCode;
    // const isConfPanelExpand = config.isPanelExpand;
    // const isMine = isConfSenderCode === rAuthUserCode;
    // const selectConf = {
    //   currentCode: config.caseCode,
    //   currentSenderCode: isConfSenderCode
    // };

    // const isPanelExpanelConfig = isMine && isConfPanelExpand
    //   ? { type: expanelTypeString, value: 'sender', stage: config.stage }
    //   : { type: expanelTypeString, value: '', stage: "" };

    // if (isConfPanelExpand) {
    //   storage.remove(mapperStorageCurrentCode);
    //   storage.remove(mapperStorageCurrentOnlyChecked);
    // } else {
    //   storage.set(mapperStorageCurrentOnlyChecked, config.onlyCheck);
    //   storage.set(mapperStorageCurrentCode, selectConf);
    // }
    // LISTING_WORKS_SEARCH_SAGAS.init(isPanelExpanelConfig);
    // Actions.listing_select_panel(selectConf);
    const {type} = config;

    if(type === HANDLEEVENTTYPE.link){
      sessionStorage.setItem("worksDetailTarget", config.caseCode);
      props.history.push(`/works/detail`);
    }

    if(type === HANDLEEVENTTYPE.workHidden){
      const hideConf = {
        "userCode": rAuthUserCode,
        "caseCodeArr": [config.caseCode]
      }
      INFO_WORKS_CARD_HIDE_SAGAS(hideConf);
    }

  }

  /**
   * 체크박스 전체 싱글 선택 관리 
   * config : {"type": string, "key": string // duedate를 key로 잡는다}
   */
  const handleCheck = config => e => {
    const {type, key} = config;
    const isChecked = e.target.checked;
    const checkboxValue = e.target.value;

    if (type === HANDLEEVENTTYPE.allSelect) {
      let copyCheckEventId = [];
      rListingWorksGroupList.forEach(item => {
        if(item.duedate === checkboxValue){
          copyCheckEventId = isChecked ? item.list : [];
        }
      });

      setValues(draft => {
        draft.checkEventId[checkboxValue] = copyCheckEventId;
        draft.allCheckBox[checkboxValue] = isChecked;
      });
    }
    if (type === HANDLEEVENTTYPE.singleSelect) {
      rListingWorksGroupList.forEach(item => {
        if(item.duedate === key){
          item.list.forEach(i => {
            if(i.caseCode === checkboxValue){
              if(isChecked){
                setValues(draft => {
                  values.checkEventId[key] !== undefined ? 
                  draft.checkEventId[key].push(i) 
                  : 
                  draft.checkEventId[key] = [i];
                });
              }else{
                const itemToFind = values.checkEventId[key].find(i => i.caseCode === checkboxValue);
                const idx = values.checkEventId[key].indexOf(itemToFind);
                if(idx !== -1){
                  setValues(draft => {
                    draft.checkEventId[key].splice(idx, 1);
                  });
                }
              }
              
            }
          });
        }
      });
    } 

  }

  // NOTE: ArrowContainer Saga function
  /**
   * 
   * @param {object} config 
   */
  const handleArrowPageSagas = config =>
    LISTING_WORKS_SEARCH_SAGAS({ ...searchConfig, ...config });

  // NOTE: unmount observable
  useEffect(() => {
    return () => {
      LISTING_WORKS_SEARCH_SAGAS.init({ type: expanelTypeString, value: '' });
      LISTING_WORKS_SEARCH_SAGAS.init();
      INFO_WORKS_APP_DATA_UPLOAD_SAGAS.init()
      INFO_CASE_COMPLETE_SAGAS.init();
      INFO_WORKS_DIRECT_FILE_UPLOAD.init();
      INFO_WORKS_CASE_UPDATE_SAGAS.init();
      COMMON_EXE_NAV_SUBMIT_SAGAS.init();
      storage.remove(mapperStorageCurrentCode);
    }
  }, []);

  // 웍스 리스트 요청 성공시 체크박스 초기화
  useEffect(() => {
    if(rListingWorksSuccess){
      setValues(draft => {
        draft.allCheckBox = initState.allCheckBox;
        draft.checkEventId = initState.checkEventId;
      });
    }
  },[rListingWorksSuccess]);

  useEffect(() => {
    Actions.works_list_checkbox(values.checkEventId);
  }, [values.checkEventId]);

  if (isWorksListLoading) return <WorksWhiteSpace />;

  return (
    <Styled.WorksCardList {...props}>
      {isGroupListLengthZero &&
        <div className="works__nosearch_box">
          <NoDataSearch text={'검색 결과가 없습니다.'} />
        </div>
      }
      <div>
        <WorksCardList
          list={rListingWorksGroupList}
          onClick={handleClick}
          handleCheck={handleCheck}
          checkEventId={values.checkEventId}
          allCheckBox={values.allCheckBox}
          isPending={isPending}
        />
      </div>
      <div className="arrow__container_box">
        <ArrowPageContainer
          sagas={handleArrowPageSagas}
          success={rListingWorksSuccess}
          failure={rListingWorksFailure}
          pending={rListingWorksPending}
          page={rListingWorks.pagingData.page}
          url={'/works'}
          allUrl={queryString.parse(queryLocationSearch)}
          matchUrl={getUrlpage}
          pagingData={rListingWorks.pagingData}
          paging={pagingArrowIconConfig}
        />
      </div>
    </Styled.WorksCardList>
  );
});

// NOTE: WorksList의 데이터가 로딩중일떄 보이는 공백 로딩바
const WorksWhiteSpace = () =>
  <Styled.WorksWhite >
    <div className="works__loading">
      <CustomLoadingCircle />
    </div>
  </Styled.WorksWhite>;

const Styled = {
  WorksWhite: styled.div`
   & {
    position:relative;
    min-height:71vh;
    background:white;
    .works__loading{
      z-index:1;
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      color:red;
    }
   }
  `,
  WorksCardList: styled.div`
    & {
      .works__nosearch_box{
        margin-top:30px;
      }
      .arrow__container_box{
        margin-top: 25px;
        text-align:right;
      }
      .Arrow__btn_svg{
        padding:1px;
      }
      .MuiExpansionPanelSummary-content.Mui-expanded{
        margin:12px 0;
      }
      .MuiExpansionPanelDetails-root{
        margin:0;
      }
      .MuiExpansionPanelDetails-root{
        display:block;
      }
      .MuiExpansionPanelSummary-root,.MuiExpansionPanelDetails-root{
        padding:0;
      }
      .MuiExpansionPanel-root:before,.MuiExpansionPanel-root:after{
        opacity:0;
      }
      .MuiExpansionPanel-root.Mui-expanded{
        margin: 0;
       }
      .MuiPaper-elevation1{
        box-shadow:none;
      }
    }
  `
}


export default withRouter(WorkContainer);







// NOTE: CaseCard Detail Container init useEffect
// INFO_CASE_COMPLETE_SAGAS.init();
// INFO_WORKS_CASE_UPDATE.init();
// COMMON_EXE_NAV_SUBMIT_SAGAS.init();








































// DEBUG: 나중에 볼수도 있음.
// const notReadStageList      = [0,1,3,4,5];
// const WorkContainer = React.memo(function WorkContainer() {
//   useEffect(() => {
//     return () => {
//       LISTING_WORKS_SEARCH_SAGAS.init();
//       INFO_WORKS_APP_DATA_UPLOAD_SAGAS.init()
//       INFO_CASE_COMPLETE_SAGAS.init();
//       INFO_WORKS_DIRECT_FILE_UPLOAD.init();
//       INFO_WORKS_CASE_UPDATE_SAGAS.init();
//       storage.remove('worksCurrentCode');
//     }
//   }, []);

//   return <WorksCardListPanel />;
// });


// import {useSelector} from 'react-redux';
// import {CustomLoadingCircle} from 'components/base/loading';  
// import styled from 'styled-components';

// const {
//   // auth:authReducer,
//   listing:listingReducer,
// } = useSelector(state=>state);
// const newList = listingReducer.works.groupList;

// const Styled ={
//   WorksWhite:styled.div`
//     position:absolute;
//     width:100%;
//     left:0;
//     top:0;
//     min-height:71vh;
//     z-index:10;
//     background:white;
//     .works__loading{
//       z-index:1;
//       position:absolute;
//       left:50%;
//       top:50%;
//       transform:translate(-50%,-50%);
//       color:red;
//     }
//   `
// }
  // DEBUG:// 살리기
  // if(listingReducer.works.pending ){
  //   return (
  //      <Styled.WorksWhite >
  //        <div className="works__loading">
  //         <CustomLoadingCircle />
  //        </div>
  //      </Styled.WorksWhite>
  //    );
  // }

  // if(!listingReducer.works.success || true) return (
  //   <Styled.WorksWhite >
  //     <span className="works__loading">
  //       <LoadingCircle size={30}/>
  //     </span>
  //   </Styled.WorksWhite>
  // );



//   const userCode =authReducer.signIn.profile.userCode;
// works list랑 case update랑 달라서그럼....... 이거 잡아야함
 // const handleSubmit = config=>{
  //   const {type, value} = config;
  //   console.log(config);
  //   if(type ==='edit_ok'){
  //     INFO_CASE_UPDATE_SAGAS(value);
  //   }
  // }




        // onClick={handleClick}
  // const handleClick = config=>{
  //   const detailConf ={
  //     userCode : userCode,
  //     caseCode : config.caseCode,
  //   }
  //   if(config.caseCode === infoReducer.works.data.caseCode){
  //     INFO_WORKS_DETAIL_SAGAS.init();
  //   }else{
  //     INFO_WORKS_DETAIL_SAGAS(detailConf);
  //   }
  // }

  // const handleClick = config=>{
  //   console.log(config);
  // }