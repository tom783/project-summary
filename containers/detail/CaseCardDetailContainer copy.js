import React, { useEffect } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import moment from 'moment';
import { mapper } from 'lib/mapper';
import { storage } from 'lib/library';
import { Actions } from 'store/actionCreators';
import { useImmer } from 'use-immer';
import { withRouter } from 'react-router-dom';
import { PlainModal } from 'components/common/modal';
import { PlainEditor } from 'components/common/editor';
import { useSelector } from 'react-redux';
import { CaseCardArea } from 'components/common/card';
import { ENV_MODE_DEV } from 'lib/setting';
import { HtmlConverter } from 'components/base/helpers/convert';
import { FullScreenLoading } from 'components/base/loading';
import { S_CustomCaseTimeLine } from 'components/common/tooltip';
import {
  font,
  color
} from 'styles/__utils';
import {
  ModalMemoContent,
  ModalComplete,
  ModalIndicationContent
} from 'components/common/modal';
import {
  checkValueDash,
  convertDateTime,
} from 'lib/library';
import {
  INFO_CASE_LOAD_SAGAS,
  INFO_WORKS_CASE_UPDATE_SAGAS,
  INFO_CASE_COMPLETE_SAGAS,

  INFO_WORKS_CASE_UPDATE,
  COMMON_EXE_NAV_SUBMIT_SAGAS
} from 'store/actions';

const CaseCardContainerState = {
  modal: {
    isPlainModalShow: false,
    value: '',
    isUpdateShow: false,
    isUpdateType: "",
  },
  isUpdateModal: {
    isShow: false,
    title: "",
    content: ""
  },
  inticationModal: {
    isShow: false,
    content: ""
  },
  memo: {
    isEdit: false,
    content: "",
    currentType: "",
    sender: {
      content: "",
      isEdit: false,
    },
    receiver: {
      content: "",
      isEdit: false,
    }
  },
  render: {
    index: 0
  },
  updateData: {

  },
  isComplete: '',
  data: {}
}

const CaseCardContainer = React.memo(function CaseCardContainer(props) {
  const [values, setValues] = useImmer(CaseCardContainerState);
  const { authReducer, infoReducer, listingReducer } = useSelector(
    ({ auth, info, listing }) => ({
      authReducer: auth,
      infoReducer: info,
      listingReducer : listing,
    }));

  const userCode = authReducer.signIn.profile.userCode;
  const storageCurrentCode = storage.get(mapper.localStorage.worksCurrentCode) || false;
  const mapperWorksFlag = mapper.worksPage.worksFlag;
  const rWorksDetail = infoReducer.works.worksDetail;
  const valuesData = rWorksDetail.current;
  const currentCode = storageCurrentCode && storageCurrentCode.currentCode;
  const curCase = currentCode === valuesData.caseCode;
  const curStage = valuesData.stage;
  const rCaseUpdate = infoReducer.case.update;
  const rCaseComplete = infoReducer.case.complete;
  const labelConf = listingReducer.processType[valuesData.stage];
  console.log("DD@@@@",labelConf );
  const senderName = valuesData.sender && valuesData.sender.company;
  const senderCode = valuesData.sender && valuesData.sender.code;
  const receiverManager = valuesData.receiver && valuesData.receiver.manager;
  const senderInfo = senderName && senderCode && `${valuesData.sender.company} (${senderCode})`;
  const strDueDate = moment.unix(valuesData.dueDate).format('YYYY-MM-DD');
  const ManagerName = valuesData.responsibility;
  const isSenderCase = valuesData.sender && valuesData.sender.code === userCode;
  const isReceiverCase = valuesData.receiver && valuesData.receiver.code === userCode;
  const currentType = isSenderCase ? 'sender' : isReceiverCase ? "receiver" : "";
  const isCurrentTypeSender = currentType === 'sender';
  const isCurrentTypeReceiver = currentType === 'receiver';
  const isMemoEdit = values.memo.isEdit;
  const isCompleteStage = curStage === mapperWorksFlag.complete;
  const isDownloadStage = curStage === mapperWorksFlag.download;

  const isSuccessLoad = infoReducer.case.load.success && curCase;
  const isSuccessCaseUpdate = rCaseUpdate.success && curCase;
  const isModifyMemoFailure = rCaseUpdate.failure && curCase;
  const isModifyMemoSuccess = rCaseUpdate.success && curCase;
  const isCompleteUpdateSuccess = rCaseComplete.success && curCase;
  const isCompleteUpdateFailure = rCaseComplete.failure && curCase;
  const isDetailLoading = rCaseUpdate.pending || rCaseComplete.pending;
  const hasReducerSenderMemo = rCaseUpdate.sender.memo;
  const hasReducerReceiverMemo = rCaseUpdate.receiver.memo;

  const timeLineList = [
    {
      id: 0,
      title: "Create",
      time: valuesData.timeline.create,
    },
    {
      id: 1,
      title: "Working",
      time: valuesData.timeline.working,

    },
    {
      id: 2,
      title: "Uploaded",
      time: valuesData.timeline.upload,

    },
    {
      id: 3,
      title: "Read",
      time: valuesData.timeline.read,

    },
    {
      id: 4,
      title: "Downloaded",
      time: valuesData.timeline.download,

    },
    {
      id: 5,
      title: "Completed",
      time: valuesData.timeline.completed,

    },
  ];

  const defaultConfig = {
    caseCode: valuesData.caseCode,
    caseId: valuesData.caseId,
    stage: valuesData.stage,
    userCode,
  }
  const customSenderInfo = {
    ...defaultConfig,
    ...valuesData.sender,
    memo: values.memo.sender.content,
  };
  const customReceiverInfo = {
    ...defaultConfig,
    ...valuesData.receiver,
    modifyState: true,
    memo: values.memo.receiver.content,
  };

  // NOTE: Detail 안의 클릭이벤트
  /**
   * 
   * @param {object} config 
   */
  const handleClick = config => {
    const { type, name, value } = config;
    const isSender = userCode === valuesData.senderCode;
    const isNameEditOk = name === 'edit_ok';
    const isNameEdit = name === 'edit';
    const isNameComplete = name === "complete";
    const isNameCompleteCancel = name === 'complete_cancel';
    const isTypeMemo = type === 'memo';
    const isTypeSetting = type === 'setting';
    const isTypeComplete = type === 'complete';
    const isTypeIndication = type === 'indication';
    const isConfigDim = config === 'dim';
    const isConfigDimOk = config === 'dim_ok';

    if (isTypeMemo) {
      if (isNameEditOk) {
        const memoConfig = {
          userCode: userCode,
          caseCode: valuesData.caseCode,
          memo: values.memo.content,
          completeFlag: false,
          type: isSender ? 0 : 1
        }
        INFO_WORKS_CASE_UPDATE_SAGAS(memoConfig);
      } else {
        setValues(draft => {
          draft.memo.isEdit = isNameEdit;
          draft.modal.isPlainModalShow = !draft.modal.isPlainModalShow;
          draft.modal.value = value;
        });
      }

    }
    if (isConfigDim) {
      setValues(draft => {
        draft.modal.isPlainModalShow = false;
        draft.isUpdateModal.isShow = false;
        if (isCurrentTypeSender) {
          draft.memo.content = customSenderInfo.memo
        }
        if (isCurrentTypeReceiver) {
          draft.memo.content = customReceiverInfo.memo
        }
      });
    }
    if (isConfigDimOk) {
      setValues(draft => {
        draft.modal.isPlainModalShow = false;
        draft.isUpdateModal.isShow = false;
        draft.modal.isUpdateShow = false;
        draft.inticationModal.isShow = false;
        draft.render.index = draft.render.index + 1
      });
      INFO_CASE_COMPLETE_SAGAS.init();
    }
    if (isTypeSetting) {
      const loadConf = {
        userCode: userCode,
        caseCode: valuesData.caseCode,
      };
      INFO_CASE_LOAD_SAGAS(loadConf);
    }
    if (isTypeComplete) {
      if (isNameComplete) {
        const completeConf = {
          userCode: userCode,
          caseCode: valuesData.caseCode,
          isComplete: true,
        }
        INFO_CASE_COMPLETE_SAGAS(completeConf)
      }
      if (isNameCompleteCancel) {
        const completeConf = {
          userCode: userCode,
          caseCode: valuesData.caseCode,
          isComplete: false,
        }
        INFO_CASE_COMPLETE_SAGAS(completeConf)
      }
    }
    if (isTypeIndication) {
      setValues(draft => {
        draft.inticationModal.isShow = true;
      })
    }
  }

  // NOTE: 메모 블러 이벤트
  /**
   * 
   * @param {object} config 
   */
  const handleBlur = config => {
    const { type, value } = config;
    const isNotNullType = type !== null;
    if (isNotNullType) {
      setValues(draft => {
        draft.memo.currentType = type;
        draft.memo.content = value.data;
      });
    }
  }

  // NOTE: 로드 성공시
  useEffect(() => {
    if (isSuccessLoad) props.history.push('/case');
  }, [isSuccessLoad]);

  // NOTE: 케이스 업데이트 ㅡ성공시
  useEffect(() => {
    if (isSuccessCaseUpdate) {
      const cType = values.memo.currentType;
      const isNotNullCtype = cType !== null;
      if (isNotNullCtype) {
        setValues(draft => {
          draft.memo[cType].content = values.memo.content;
        });
        INFO_WORKS_CASE_UPDATE_SAGAS.init({ type: "default" });
      }
    }
  }, [isSuccessCaseUpdate]);

  // NOTE: 메모 init
  useEffect(() => {
    setValues(draft => {
      draft.memo.sender.content = valuesData.sender.memo;
      draft.memo.receiver.content = valuesData.receiver.memo;
    });
  }, [valuesData.sender.memo, valuesData.receiver.memo]);

  // NOTE: 메모 기존데이터 있으면 업데이트
  useEffect(() => {
    if (curCase) {
      setValues(draft => {
        if (hasReducerSenderMemo) {
          draft.memo.sender.content = hasReducerSenderMemo;
        } else if (hasReducerReceiverMemo) {
          draft.memo.receiver.content = hasReducerReceiverMemo;
        }
      });
    }
  }, [hasReducerSenderMemo, hasReducerReceiverMemo]);

  // NOTE: memo modify
  useEffect(() => {
    if (isModifyMemoSuccess && curCase) {
      setValues(draft => {
        // draft.modal.isPlainModalShow = false;
        draft.modal.isUpdateShow = true;
        draft.modal.isUpdateType = 'success'
        draft.isUpdateModal.isShow = true;
        draft.isUpdateModal.title = "수정 완료";
        draft.isUpdateModal.content = "메모가 수정되었습니다."
      });
    }
    if (isModifyMemoFailure && curCase) {
      setValues(draft => {
        // draft.modal.isPlainModalShow = false;
        draft.modal.isUpdateShow = true;
        draft.modal.isUpdateType = ' falilre';
        draft.isUpdateModal.isShow = true;
        draft.isUpdateModal.title = "실패하였습니다.";
        draft.isUpdateModal.content = "잠시 후 다시 시도해주세요."
      });
    }
  }, [isModifyMemoFailure, isModifyMemoSuccess]);

  // NOTE: works complete 
  useEffect(() => {
    if (isCompleteUpdateSuccess) {
      const rIsComplete = rCaseComplete.isComplete;
      setValues(draft => {
        // draft.modal.isUpdateShow = true;
        draft.isUpdateModal.isShow = true;
        draft.isUpdateModal.title = "업데이트 완료!";
        draft.isUpdateModal.content = "업데이트가 완료되었습니다.";
        draft.data.stage = rIsComplete ? 5 : 4
      });
    }
    if (isCompleteUpdateFailure) {
      setValues(draft => {
        draft.isUpdateModal.isShow = true;
        draft.isUpdateModal.title = "업데이트 실패";
        draft.isUpdateModal.content = "업데이트에 실패하였습니다.";
      })
    }
  }, [isCompleteUpdateSuccess, isCompleteUpdateFailure]);

  // NOTE: init reset works detail reducer
  useEffect(() => {
    if (curCase) {
      Actions.info_works_cloud_reset();
      INFO_CASE_COMPLETE_SAGAS.init();
      INFO_WORKS_CASE_UPDATE.init();
      COMMON_EXE_NAV_SUBMIT_SAGAS.init();
    }
  }, [])

  let receiverInfo = valuesData.receiver;
  if (receiverInfo) {
    receiverInfo = receiverInfo.manager
      ? `${receiverInfo.company} (${receiverManager})`
      : receiverInfo.company
  }

  return (
    <>
      {curCase && isDetailLoading && <FullScreenLoading dim={true} />}
      <PlainModal
        isOpen={values.modal.isPlainModalShow}
        content={
          <ModalMemoContent
            contentHeight={!isMemoEdit && 250}
            content={
              isMemoEdit
                ? <PlainEditor
                  maxLength={5000}
                  height={300}
                  onBlur={(value) => handleBlur({ type: currentType, value })}
                  content={values.modal.value}
                />
                : <HtmlConverter>{values.modal.value}</HtmlConverter>
            }
            isEdit={isMemoEdit}
            onClick={handleClick}
          />}
        onClick={handleClick}
        dim={isMemoEdit ? false : true}
        width={380}
      />
      <PlainModal
        isOpen={values.isUpdateModal.isShow}
        content={<>
          <ModalComplete
            title={values.isUpdateModal.title}
            onClick={() => handleClick('dim_ok')}
            children={values.isUpdateModal.content}
          />
        </>}
        dim={false}
        onClick={() => handleClick('dim_ok')}
        width={380}
      />
      <PlainModal
        isOpen={values.inticationModal.isShow}
        content={<ModalIndicationContent info={'hello'} />}
        dim={true}
        width={380}
        onClick={() => handleClick('dim_ok')}
      />

      <Styled.CaseCardDetail labelColor={labelConf.color}>
        <div className="WorksCard_nav">
          <div className="WorksCard_nav_btn">
            <button>
              BACK
            </button>
          </div>
          <div className="WorksCard_nav_label">
            <div className="WorksCard_nav_caseId">
              {valuesData && valuesData.caseId}
            </div>
            <div className="WorksCard_nav_state">
              {labelConf.title}
            </div>
          </div>
        </div>
        <Grid container className="WorksCardListPanel__info_box">
          <Grid container className="WorksCardListPanel__row">
            <Grid item xs={3}>
              <div className="WorksCardListPanel__title">Case ID</div>
            </Grid>
            <Grid item xs={9}>
              <div className="WorksCardListPanel__con">{valuesData.caseId}</div>
            </Grid>
          </Grid>

          <Grid container className="WorksCardListPanel__row">
            <Grid item xs={3}>
              <div className="WorksCardListPanel__title">Pateint Name</div>
            </Grid>
            <Grid item xs={9}>
              <div className="WorksCardListPanel__con">{valuesData && valuesData.patient}</div>
            </Grid>
          </Grid>

          <Grid container className="WorksCardListPanel__row">
            <Grid item xs={3}>
              <div className="WorksCardListPanel__title">Due Date</div>
            </Grid>
            <Grid item xs={9}>
              <div className="WorksCardListPanel__con">{strDueDate}</div>
            </Grid>
          </Grid>

          <Grid container className="WorksCardListPanel__row">
            <Grid item xs={3}>
              <div className="WorksCardListPanel__title">{mapper.sender}</div>
            </Grid>
            <Grid item xs={9}>
              <div className="WorksCardListPanel__con">{checkValueDash(senderInfo)}</div>
            </Grid>
          </Grid>

          <Grid container className="WorksCardListPanel__row">
            <Grid item xs={3}>
              <div className="WorksCardListPanel__title">{mapper.receiver}</div>
            </Grid>
            <Grid item xs={9}>
              <div className="WorksCardListPanel__con">{checkValueDash(receiverInfo)}</div>
            </Grid>
          </Grid>

          <Grid container className="WorksCardListPanel__row">
            <Grid item xs={3}>
              <div className="WorksCardListPanel__title">Manager</div>
            </Grid>
            <Grid item xs={9}>
              <div className="WorksCardListPanel__con">{checkValueDash(ManagerName)}</div>
            </Grid>
          </Grid>

          {ENV_MODE_DEV &&
            <Grid container className="WorksCardListPanel__row">
              <Grid item xs={3}>
                <div className="WorksCardListPanel__title indication">Indication</div>
              </Grid>
              <Grid item xs={9}>
                <div className="WorksCardListPanel__con">
                  <button
                    className="WorksCardListPanel_btn"
                    onClick={() => handleClick({ type: "indication" })}
                  >View</button>
                </div>
              </Grid>
            </Grid>
          }

          <Grid container className="WorksCardListPanel__row">
            <Grid container className="WorksCardListPanel__title">
              <span className="WorksCardListPanel__title_tx">Case TimeLine</span>
              <S_CustomCaseTimeLine iconStyle={`top:-4px`} />
            </Grid>
            <Grid container className="WorksCardListPanel__con">
              <div className="WorksCardListPanel__progressbar">
                <ul className="WorksCardListPanel__progressbar_box">
                  {timeLineList.map(item =>
                    <li
                      key={item.id}
                      className={cx("WorksCardListPanel__progressbar_step",
                        { active: item.id <= curStage, upload: item.id === 2 })}
                    >
                      {item.title}
                      <p className="date_tx">
                        {convertDateTime({ value: item.time, format: "MM-DD, HH:mm", isNull: '-' })}
                      </p>
                    </li>
                  )
                  }
                </ul>
              </div>
            </Grid>
          </Grid>

          {/* sender area */}
          <CaseCardArea
            caseType={isReceiverCase}
            info={customSenderInfo}
            handleClick={handleClick}
            type="sender"
            hasReceiver={valuesData && valuesData.receiver.company}
          />

          {/* receiver area */}
          <CaseCardArea
            caseType={isSenderCase}
            info={customReceiverInfo}
            handleClick={handleClick}
            type="receiver"
            hasReceiver={valuesData && valuesData.receiver.company}
          />

          <Grid container className={cx(
            "WorksCardListPanel__row", "area_row",
            { hasNotReceiver: (!valuesData && valuesData.receiver.company || !isDownloadStage) && (!isCompleteStage && !isDownloadStage) },
            { isNotShow: isSenderCase }
          )}>

            <Grid item xs={3}>
              <div className="WorksCardListPanel__title">Complete</div>
            </Grid>
            <Grid item xs={9}>
              <Grid container className={cx("WorksCardListPanel__con", "contents")}>
                <button
                  className={cx("WorksCardListPanel__complete")}
                  onClick={() => handleClick({ type: "complete", name: isCompleteStage ? "complete_cancel" : "complete" })}
                >{isCompleteStage ? "Cancel" : "Complete"}</button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Styled.CaseCardDetail>
    </>
  );
})

const Styled = {
  CaseCardDetail: styled.div`
  .WorksCard_nav {
    display: flex;

    .WorksCard_nav_btn {
      button {
        position: relative;
        width: 90px;
        height: 50px;
        padding-left: 30px;
        background-color: #00A6E2;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        border: none;
        cursor: pointer;
        
        &:before {
          content: '';
          width: 8px;
          height: 8px;
          border-left: 2px solid #fff;
          border-top: 2px solid #fff;
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%) rotate(-45deg);
        }
      }
    }

    .WorksCard_nav_label {
      position: relative;
      display: flex;
      flex: 1;
      box-shadow: 1px 1px 4px rgba(36, 47, 53, 0.2);
      justify-content: space-between;
      align-items: center;
      margin-left: 5px;
      height: 50px;
      padding-left: 20px;
      padding-right: 15px;
      background-color: #fff;

      &:before {
        content: '';
        width: 5px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #9DC7E0;
      }

      .WorksCard_nav_caseId {
        color: #242F35;
        font-size: 18px;
      }

      .WorksCard_nav_state {
        font-size: 13px;
        font-weight: 600;
        text-shadow: 1px 1px 0px rgba(36, 47, 53, 0.25);
        color: #fff;
        width: 100px;
        height: 30px;
        line-height: 30px;
        background-color: #FEC600;
        border-radius: 30px;
        text-align: center;
      } 

    }

  }


  .WorksCardListPanel_btn{
    padding: 5px 15px;
    min-width:100px;
    background: ${color.blue};
    ${font(14, color.white)};
    margin-right: 5px;
    border-radius: 2px;
    border: none;
    transition: all .2s;
    cursor: pointer;

    &:hover {
      background: ${color.blue_hover};
    }
  }

  .isShow{
    display:block
  }
  .isNotShow{
    display:none;
  }
  .hasNotReceiver{
    position: relative;
    pointer-events: none;
    &:after{
      display:block;
      position:absolute;
      content:'';
      left:0;
      top:0;
      width:100%;
      height:100%;
      background:white;
      opacity:.5;
      z-index:1;
    }
  }
  .WorksCardListPanel__info_box{
    border: 1px solid ${color.gray_border6};
    border-radius: 10px;
    padding: 30px;
    padding-top: 40px;
    position: relative;
    margin-bottom:20px;
    
  }
  
  .WorksCardListPanel__share_btn {
    color: ${color.black_font};
    position: absolute;
    top:40px;
    right: 30px;
  }
  .MuiExpansionPanelDetails-root{
    padding: 0;
  }

  .WorksCardListPanel__row{
    padding-bottom: 25px;

    &.ribbon{
      padding-bottom: 20px;
    }

    &.area_row{
      padding-bottom: 20px;
    }
  }

  .WorksCardListPanel__title{
    ${font(16, color.black_font)};
    font-weight: 600;
    position:relative;
    &.indication{
      top:5px;
    }
  }
  .WorksCardListPanel__title_tx{
    margin-right:5px;
  }

  .WorksCardListPanel__con{
    ${font(16, color.gray_font)};
  }

  .MuiStepper-root {
    padding: 20px;
  }
  .MuiStepButton-root{
    width: 150%;
    margin: -24px -30px;
    padding: 24px 0;

  }
  .MuiStepConnector-alternativeLabel {
    top: 12px;
    left: calc(-50% + 4px);
    right: calc(50% + 19px);
    position: absolute;
  }
  .MuiStepLabel-labelContainer{
    ${font(14, color.gray_font)};
  }
  .MuiStepLabel-label{
    ${font(14, color.disable_btn)};
  }
  .MuiStepLabel-label.MuiStepLabel-active{
    ${font(14, color.blue)};
  }
  .MuiStepIcon-root{
    color: ${color.disable_btn};
  }
  .MuiStepIcon-root.MuiStepIcon-active {
    color: ${color.blue};
  }

  .WorksCardListPanel__progressbar {
    margin-top: 60px;
    width:100%;
  }
  .WorksCardListPanel__progressbar_box {
    width: 100%;
    margin: 0;
    padding: 0;
    ${font(14, color.disable_btn)};
  }
 
 .WorksCardListPanel__progressbar_step{
   position: relative;
   display: inline-block;
   text-align: center;
   width:calc(100% / 6);
   @media (max-width:1000px){
    width:calc(100% / 3);
    &.upload{
      margin-bottom:40px;
    }
    &.upload:after{
      display:none;
    }
   }
    &:before {
       /* position: relative; */
       position:absolute;
       content: attr(data-step);
       display: block;
       background: ${color.disable_btn};
       width: 20px;
       height: 20px;
       text-align: center;
       /* margin: 0 42px; */
       /* margin-bottom: 10px; */
       line-height: 20px;
       border-radius: 100%;
       z-index: 1000;
       left:50%;
       top:-30px;
       transform:translateX(-50%);
     }
 
     &:after {
       content: '';
       position: absolute;
       display: block;
       background: ${color.disable_btn};
       width: 100%;
       height: 1px;
       top: -20px;
       left: 50%;
     }
     &:last-child:after {
       display: none;
     }
     &.active {
       color: ${color.blue};
       
       &:before {
         background: ${color.blue};
       }
     }
  }
    .date_tx{
      padding-top: 5px;
     ${font(13, color.gray_font)};
   }

   .WorksCardListPanel__complete{
     padding: 5px 15px;
     border: none;
     background: ${color.complete_btn};
     ${font(14, color.white)};
     border-radius: 2px;
     cursor:pointer;
     transition: all .2s;
   
     &:hover {
      background: ${color.complete_btn_hover};
      color: ${color.white};
    }
   }
   
  `
}
export default withRouter(CaseCardContainer);
