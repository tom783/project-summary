import React, { useEffect } from 'react';
import styled from 'styled-components';
import { NoDataSearch } from 'components/common/search';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { Actions } from 'store/actionCreators';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withRouter } from 'react-router-dom';
import queryString from "query-string";
import { ArrowPageContainer } from 'containers/pagination';
import { CustomLoadingCircle } from 'components/base/loading';
import { storage } from 'lib/library';
import cx from 'classnames';
// import _ from 'lodash';
import { WorksCardList } from 'components/common/listing';
import {
  LISTING_WORKS_SEARCH_SAGAS,
  INFO_CASE_COMPLETE_SAGAS,
  INFO_WORKS_CASE_UPDATE,
} from 'store/actions';


const WorksCardListPanel = React.memo(function WorksCardListPanel(props) {
  const { authReducer, listingReducer, infoReducer } = useSelector(
    ({ auth, listing, info }) => ({
      authReducer: auth,
      listingReducer: listing,
      infoReducer: info
    }));
  const classes = useStyles();
  const rInfoWorks = infoReducer.works;
  const rAuthUserCode = authReducer.signIn.profile.userCode;
  const rListingWorks = listingReducer.works;
  const rListingWorksGroupList = rListingWorks.groupList || [];
  const rListingWorksSearch = rListingWorks.search;
  const rListingWorksPagingData = rListingWorks.pagingData;
  const isEndPrevPage = !rListingWorksPagingData.prevCheck;
  const isEndNextPage = !rListingWorksPagingData.nextCheck;
  const isPending = rInfoWorks.detail && rInfoWorks.detail.pending;
  const getUrlpage = props.match.params.list;
  // const notReadStageList      = [0,1,3,4,5];
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

  const searchConfig = {
    userCode: rAuthUserCode,
    page: getUrlpage,
    sort: rListingWorksSearch.sort,
    search: rListingWorksSearch.search,
    type: rListingWorksSearch.type,
    first: false
  }

  // NOTE: WorksList Click event
  /**
   * 
   * @param {object} config 
   */
  const handleClick = config => {
    const isConfSenderCode = config.senderCode;
    const isMine = isConfSenderCode === rAuthUserCode;
    const isConfPanelExpand = config.isPanelExpand;
    const selectConf = {
      currentCode: config.caseCode,
      currentSenderCode: isConfSenderCode
    };

    const isPanelExpanelConfig = isMine && isConfPanelExpand
      ? { type: "typeChange", value: 'sender', stage: config.stage }
      : { type: "typeChange", value: '', stage: "" };

    INFO_CASE_COMPLETE_SAGAS.init();
    INFO_WORKS_CASE_UPDATE.init();
    LISTING_WORKS_SEARCH_SAGAS.init(isPanelExpanelConfig);

    if (isConfPanelExpand) {
      storage.remove('worksCurrentCode');
      storage.remove('worksCurrenctOnlyChecked');
    } else {
      storage.set('worksCurrenctOnlyChecked', config.onlyCheck);
      storage.set('worksCurrentCode', selectConf);
    }
    Actions.info_works_cloud_reset();
    Actions.listing_select_panel(selectConf);
  }


  // NOTE: ArrowContainer Saga function
  const handleArrowPageSagas = (config) =>
    LISTING_WORKS_SEARCH_SAGAS({ ...searchConfig, ...config });

  // NOTE: 마운트 해제 init
  useEffect(() => {
    return () => LISTING_WORKS_SEARCH_SAGAS.init({ type: "typeChange", value: '' })
  }, []);

  if (!rListingWorks.success || rListingWorks.pending) {
    return <WorksWhiteSpace />
  }

  return (
    <Styled.WorksCardList {...props}>
      {rListingWorksGroupList.length === 0 &&
        <div style={{ marginTop: '30px' }}><NoDataSearch text={'검색 결과가 없습니다.'} /></div>
      }
      <div className={classes.root}>
        <WorksCardList
          list={rListingWorksGroupList}
          onClick={handleClick}
          isPending={isPending}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        <ArrowPageContainer
          sagas={handleArrowPageSagas}
          success={rListingWorks.success}
          failure={rListingWorks.failure}
          pending={rListingWorks.pending}
          page={rListingWorks.pagingData.page}
          url={'/works'}
          allUrl={queryString.parse(props.location.search)}
          matchUrl={props.match.params.list}
          pagingData={rListingWorks.pagingData}
          paging={pagingArrowIconConfig}
        />
      </div>

    </Styled.WorksCardList>
  );
});

const WorksWhiteSpace = () =>
  <Styled.WorksWhite >
    <div className="works__loading">
      <CustomLoadingCircle />
    </div>
  </Styled.WorksWhite>;


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

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
      .MuiGrid-grid-xs-1{
      max-width: 5%;
      flex-basis: 5%;
    }
    }

  `
}

export default withRouter(WorksCardListPanel);





// const isNotReadSaga = notReadStageList.indexOf(config.stage) === -1;
// if (config.receiverCode === userCode && isNotReadSaga && !config.isPanelExpand) {
//   INFO_WORKS_CHECK_READ_SAGAS({ caseCode: config.caseCode, userCode });
// }



