import React, { useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { WorksCard } from 'components/common/card';
import { CaseCardDetail } from 'components/common/info';
import { useSelector } from 'react-redux';
import { storage } from 'lib/library';
import { useImmer } from 'use-immer';
import {
  INFO_WORKS_CHECK_READ_SAGAS,
} from 'store/actions';

// LAGACY: CardContainer 로 사용중
const CardAndDetailInitialState = {
  data: {
    sender: {},
    receiver: {},
    timeline: {
      create: 0,
      working: 0,
      upload: 0,
      read: 0,
      download: 0,
      completed: 0,
    }
  },
  isLoading: false
};

const CardAndDetail = React.memo(function CardAndDetail(props) {
  const [values, setValues] = useImmer(CardAndDetailInitialState)
  const { info, onClick } = props;
  const {
    listing: listingReducer,
    info: infoReducer,
    common: commonReducer,
    auth: authReducer
  } = useSelector(state => state);

  const storageCurrentCode      = storage.get('worksCurrentCode') || false;
  const curCode                 = storageCurrentCode && storageCurrentCode.currentCode;
  const userCode                = authReducer.signIn.profile.userCode;
  const isSelected              = curCode === info.caseCode
  const isExpanded              = isSelected && !infoReducer.works.detail.pending;
  const isCompleteUpdateSuccess = infoReducer.case.complete.success && curCase;
  const isReceiver              = info.receiver.code === userCode;
  const valuesData              = values.data;
  const rIsComplete             = infoReducer.case.complete.isComplete;
  const rUpload                 = infoReducer.works.upload;
  const rDownload               = infoReducer.works.download;
  const notReadStageList        = [0, 1, 3, 4, 5]
  const curCase                 = storageCurrentCode && storageCurrentCode.currentCode === info.caseCode;
  const curStage                = valuesData.stage;
  const lableConf               = listingReducer.processType[valuesData.stage];
  const isCreateStage           = curStage === 0;
  const isWorkingStage          = curStage === 1;
  const isUploadStage           = curStage === 2;
  const isReadStage             = curStage === 3;
  // const isDownloadStage      = curStage === 4;
  // const isCompleteStage      = curStage === 5;

  const handleClick = config => onClick && onClick(config);

  // DEBUG: useEffect쪽 묶을수 없는지 연구 필요.

  // NOTE: Works Complte success
  useEffect(() => {
    if (curCase && isCompleteUpdateSuccess) {
      setValues(draft => {
        draft.data.stage = rIsComplete ? 5 : 4;
      })
    }
  }, [curCase, isCompleteUpdateSuccess]);

  // NOTE: working update
  const isWorkingUpdateSuccess = commonReducer.executorNav.success;
  const isWorkingUpdateFailure = commonReducer.executorNav.failure;
  const isWorkingUpdateCurCase = (isCreateStage || isWorkingStage) && curCase;
  useEffect(() => {
    if (isWorkingUpdateCurCase && isWorkingUpdateSuccess) {
      setValues(draft => {
        draft.data.stage = 1;
      })
    }
  }, [curCase, isWorkingUpdateSuccess, isWorkingUpdateFailure]);

  // NOTE: App Dataupload update
  const isUploadUpdateSuccess = rUpload.appData.success;
  const isUploadUpdateFailure = rUpload.appData.failure;
  const isUploadUpdateCurCase = (isCreateStage || isWorkingStage) && curCase;

  useEffect(() => {
    if (isUploadUpdateCurCase && isUploadUpdateSuccess) {
      setValues(draft => {
        draft.data.stage = 2;
      })
    }
  }, [curCase, isUploadUpdateSuccess, isUploadUpdateFailure]);

  // NOTE: Direct Upload and set file state
  const cDirectUploadSuccess = rUpload.direct.success;
  const cDirectUploadFailure = rUpload.direct.failure;
  const isDirectUploadUpdateCurCase = (isCreateStage || isWorkingStage) && curCase;
  useEffect(() => {
    if (isDirectUploadUpdateCurCase && cDirectUploadSuccess) {
      setValues(draft => {
        draft.data.stage = 2;
      })
    }
  }, [curCase, cDirectUploadSuccess, cDirectUploadFailure]);

  // NOTE: read update
  const isReadUpdateSuccess = infoReducer.works.read.success;
  const isReadUpdateCurCase = curCase && isReadUpdateSuccess && isUploadStage ;
  useEffect(() => {
    if (isReadUpdateCurCase && isReceiver) {
      setValues(draft => {
        draft.data.stage = 3;
      })
    }
  }, [curCase, isReadUpdateSuccess]);

  // NOTE: download update
  const isDownloadUpdateSuccess = rDownload.success;
  const isDownloadUpdateCurCase =  curCase && isReceiver && isReadStage;
  useEffect(() => {
    if (isDownloadUpdateCurCase && isDownloadUpdateSuccess) {
      setValues(draft => {
        draft.data.stage = 4;
      })
    }
  }, [curCase, isDownloadUpdateSuccess]);

  useEffect(() => {
    setValues(draft => {
      draft.data = info;
      draft.isLoading = true;
    })
  }, [info]);

  // NOTE: init
  useEffect(() => {
    if (curCase) {
      const isNotReadSaga = notReadStageList.indexOf(info.stage) === -1;
      if (info.receiver.code === userCode && isNotReadSaga) {
        INFO_WORKS_CHECK_READ_SAGAS({ caseCode: info.caseCode, userCode });
      }
    }
  }, []);

  if (!values.isLoading) return null;

  const handleWorksCardClick = _.debounce((val) => {
    // DEBUG: 온리체크 부분 수정될시 수정할것
    val.onlyCheck
      ? handleClick({ ...val, isPanelExpand: isExpanded })
      : handleClick({ ...val, isPanelExpand: isExpanded })
  }, 30);


  return (
    <>
      <Styled.CardAndDetail>
        <ExpansionPanel expanded={isExpanded} >
          <ExpansionPanelSummary
            aria-controls={`panel${info.caseCode}bh-content`}
            id={`panel${info.caseCode}bh-header`}
          >
            <WorksCard
              onClick={handleWorksCardClick}
              labelText={lableConf && lableConf.title}
              labelColor={lableConf && lableConf.color}
              info={valuesData}
              checked={isExpanded}
              expanded={isExpanded}
            />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container >
              <Grid item xs={1}></Grid>
              <Grid item xs={11} className="WorksCardListPanel__area">
                <CaseCardDetail
                  isExpanded={isExpanded}
                  info={valuesData}
                />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Styled.CardAndDetail>
    </>
  )
}, (prevProps, nextProps) => nextProps.info === prevProps.info);

const Styled = {
  CardAndDetail: styled.div`
  &{
    .WorksCardListPanel__area{
        max-width: 93%;
       flex-basis: 93%;
      }
  }
  `
}

export default CardAndDetail;














// useEffect(() => {
//   if (isCompleteUpdateSuccess1) {
//     setValues(draft => {
//       draft.data.stage = rIsComplete ? 5 : 4;
//     })
//   }
// }, [isCompleteUpdateSuccess1]);

// useEffect(() => {
//   if (isCompleteUpdateSuccess2) {
//     setValues(draft => {
//       draft.data.stage = rIsComplete ? 5 : 4;
//     })
//   }
// }, [isCompleteUpdateSuccess2]);

// useEffect(() => {
//   if (isCompleteUpdateSuccess3) {
//     setValues(draft => {
//       draft.data.stage = rIsComplete ? 5 : 4;
//     })
//   }
// }, [isCompleteUpdateSuccess3]);



// useEffectUnsafe(
//   ({isCompleteUpateSuccess1,curCase})=>{

//     setValues(draft => {
//       draft.data.stage = rIsComplete ? 5 : 4;
//     })
//   },
//   ({isCompleteUpdateSuccess2})=>{
//     setValues(draft => {
//       draft.data.stage = rIsComplete ? 5 : 4;
//     })
//   },
//   ({isCompleteUpdateSuccess3})=>{
//     setValues(draft => {
//       draft.data.stage = rIsComplete ? 5 : 4;
//     })
//   },

//   [
//     curCase, 
//     [isCompleteUpateSuccess1,2],
//     isCompleteUpateSuccess2,
//     isCompleteUpateSuccess3
//   ]
// )
