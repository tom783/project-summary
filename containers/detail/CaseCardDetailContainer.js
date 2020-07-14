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
import {SeparateTemplate} from 'components/base/template';
import {
  font,
  color
} from 'styles/__utils';
import {
  ModalMemoContent,
  ModalComplete,
  ModalIndicationContent,
  ModalConfirmContent
} from 'components/common/modal';
import {
  checkValueDash,
  convertDateTime,
} from 'lib/library';
import {
  INFO_CASE_LOAD_SAGAS,
  INFO_WORKS_CASE_UPDATE_SAGAS,
  INFO_CASE_COMPLETE_SAGAS,
  LISTING_WORKS_SEARCH_SAGAS,
  INFO_WORKS_CASE_UPDATE,
  COMMON_EXE_NAV_SUBMIT_SAGAS,
  INFO_WORKS_CARD_HIDE_SAGAS,
  INFO_CASE_DELETE_SAGAS,
} from 'store/actions';

import {
  icon_works_detail_copy,
  icon_works_detail_delete,
  icon_works_detail_hidden,
  icon_works_detail_load,
  icon_edit,
} from 'components/base/images';

const CaseCardContainerState = {
  worksDetailInfo: {},
  modal: {
    isPlainModalShow: false,
    value: '',
    isUpdateShow: false,
    isUpdateType: "",
  },
  isDeleteModal: {
    title: "",
    subtitle: "",
    type: "confirm",
    isShow: false
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
  const storageCurrentCode = sessionStorage.getItem('worksDetailTarget') || false;
  const mapperWorksFlag = mapper.worksPage.worksFlag;
  // const rWorksDetail = infoReducer.works.worksDetail;
  // const valuesData = rWorksDetail.current;
  const valuesData = values.worksDetailInfo;
  const currentCode = storageCurrentCode;
  const curCase = currentCode === valuesData.caseCode;
  const curStage = valuesData.stage;
  const rCaseUpdate = infoReducer.case.update;
  const rCaseComplete = infoReducer.case.complete;
  const labelConf = listingReducer.processType[valuesData.stage];
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
  const isDeleteSuccess = infoReducer.case.delete.success;
  const isDeleteFailure = infoReducer.case.delete.failure;
  const isSuccessLoad = infoReducer.case.load.success;
  const isSuccessCaseUpdate = rCaseUpdate.success;
  const isModifyMemoFailure = rCaseUpdate.failure;
  const isModifyMemoSuccess = rCaseUpdate.success;
  const isCompleteUpdateSuccess = rCaseComplete.success;
  const isCompleteUpdateFailure = rCaseComplete.failure;
  const isDetailLoading = rCaseUpdate.pending || rCaseComplete.pending;
  const hasReducerSenderMemo = rCaseUpdate.sender.memo;
  const hasReducerReceiverMemo = rCaseUpdate.receiver.memo;
  const timeLineList = [
    {
      id: 0,
      title: "Create",
      time: valuesData.timeline && valuesData.timeline.create,
    },
    {
      id: 1,
      title: "Working",
      time: valuesData.timeline && valuesData.timeline.working,

    },
    {
      id: 2,
      title: "Uploaded",
      time: valuesData.timeline && valuesData.timeline.upload,

    },
    {
      id: 3,
      title: "Read",
      time: valuesData.timeline && valuesData.timeline.read,

    },
    {
      id: 4,
      title: "Downloaded",
      time: valuesData.timeline && valuesData.timeline.download,

    },
    {
      id: 5,
      title: "Completed",
      time: valuesData.timeline && valuesData.timeline.completed,

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

  // Back button link 기능
  const handleHistoryBack = () => {
    props.history.goBack();
  }

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
    const isDelete = type === 'deleteModal';
    const isConfigDim = config === 'dim';
    const isConfigDimOk = config === 'dim_ok';
    const isDeleteOk = name === 'delete_ok';
    const isDeleteConfirmOk = name === "delete_confirm_ok";
    const isDeleteCancel = name === 'delete_cancel';
    const isWorksHidden = type === mapper.HANDLEEVENTTYPE.workHidden;

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
    if(isWorksHidden) {
      const hideConf = {
        "userCode": userCode,
        "caseCodeArr": [valuesData.caseCode]
      }
      INFO_WORKS_CARD_HIDE_SAGAS(hideConf);
    }
    if(isDelete) {
      setValues(draft => {
        draft.isDeleteModal.isShow = true;
        draft.isDeleteModal.type = 'delete';
        draft.isDeleteModal.title = '삭제하시겠습니까?';
        draft.isDeleteModal.subtitle = '삭제 된 케이스를 복구할 수 없습니다.';
      });
    }
    if(isDeleteCancel){
      setValues(draft => {
        draft.isDeleteModal = CaseCardContainerState.isDeleteModal;
      });
      INFO_CASE_DELETE_SAGAS.init();
    }
    if(isDeleteOk) {
      const deleteConf = {
        "userCode": userCode,
        "caseCodeArr": [currentCode]
      }
      INFO_CASE_DELETE_SAGAS(deleteConf);
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
          draft.modal.isPlainModalShow = false;
        });
        INFO_WORKS_CASE_UPDATE_SAGAS.init({ type: "default" });
      }
    }
  }, [isSuccessCaseUpdate]);

  // NOTE: 메모 init
  useEffect(() => {
    if(values.worksDetailInfo.sender ||values.worksDetailInfo.receiver){
      setValues(draft => {
        draft.memo.sender.content = valuesData.sender.memo;
        draft.memo.receiver.content = valuesData.receiver.memo;
      });
    }
  }, [values.worksDetailInfo]);

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
    const searchConfig = {
      userCode: userCode,
      page: 1,
      sort: "5",
      search: sessionStorage.getItem("worksDetailTarget"),
      filter: {
        stage: [],
        type: [],
        hidden: ""
      },
    };
    LISTING_WORKS_SEARCH_SAGAS(searchConfig);

    return () => {
      console.log('i')
      Actions.info_works_cloud_reset();
      INFO_CASE_COMPLETE_SAGAS.init();
      INFO_WORKS_CASE_UPDATE.init();
      COMMON_EXE_NAV_SUBMIT_SAGAS.init();
      LISTING_WORKS_SEARCH_SAGAS.init();
      INFO_CASE_DELETE_SAGAS.init();
    }
  }, []);

  useEffect(() => {
    if(listingReducer.works.success){
      setValues(draft => {
        // search saga를 사용해서 해당 caseCode로 검색한 결과이기 때문에 list는 1개 그래서 list[0]
        draft.worksDetailInfo = listingReducer.works.groupList[0].list[0];
      })
    }
  }, [listingReducer.works.success]);

  // works hide 성공시 works list 페이지로 이동
  useEffect(() => {
    if(infoReducer.works.hide.success){
      props.history.goBack();
    }
  },[infoReducer.works.hide]);

  // works delete
  useEffect(() => {
    if (isDeleteSuccess) {
      setValues(draft => {
        draft.isDeleteModal.isShow = false;
      });
      INFO_CASE_DELETE_SAGAS.init();
      props.history.goBack();
    }
    if (isDeleteFailure) {
      setValues(draft => {
        draft.isDeleteModal.type = "alert"
        draft.isDeleteModal.isShow = true;
        draft.isDeleteModal.title = '삭제를 실패하였습니다.';
        draft.isDeleteModal.subtitle = '잠시 후 다시 시도해주세요.';
      });
    }

  }, [isDeleteSuccess, isDeleteFailure]);


  let receiverInfo = valuesData.receiver;
  if (receiverInfo) {
    receiverInfo = receiverInfo.manager
      ? `${receiverInfo.company} (${receiverManager})`
      : receiverInfo.company
  }

  let navTopCont = <>
    <div className="WorksCard_nav">
      <div className="WorksCard_nav_btn">
        <button onClick={handleHistoryBack}>
          BACK
        </button>
      </div>
      <div className="WorksCard_nav_label">
        <div className="WorksCard_nav_caseId">
          {valuesData && valuesData.caseId}
        </div>
        <div className="WorksCard_nav_state">
          {labelConf && labelConf.title}
        </div>
      </div>
    </div>
  </>
  let leftCont = <>
    <div className="WorksCard_left_cont">
      <div className="WorksCard_left_btn">
        <button className="load">load</button>
        <button className="copy">copy</button>
        <button 
          className="hidden"
          onClick={() => handleClick({type: mapper.HANDLEEVENTTYPE.workHidden})}
        >hidden</button>
        <button 
          className="delete" 
          onClick={() => handleClick({type: "deleteModal"})}
        >delete</button>
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
            <div className="WorksCardListPanel__title">Patient</div>
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

        <Grid container className="WorksCardListPanel__row">
          <Grid container className="WorksCardListPanel__title">
            <span className="WorksCardListPanel__title_tx">Case TimeLine</span>
            <S_CustomCaseTimeLine iconStyle={`top:-4px`} />
          </Grid>
          <Grid container className="WorksCardListPanel__con">
            <div className="WorksCardListPanel__progressbar">
              <ul className="WorksCardListPanel__progressbar_box">
                {
                timeLineList.slice(0, timeLineList.length/2).map(item => (
                    <li
                      key={item.id}
                      className={cx("WorksCardListPanel__progressbar_step",
                        { active: item.id === curStage, upload: item.id === 2 })}
                    >
                      {item.title}
                      <p className="date_tx">
                        {convertDateTime({ value: item.time, format: "MM-DD, HH:mm", isNull: '-' })}
                      </p>
                    </li>
                ))
                }
              </ul>
              <ul className="WorksCardListPanel__progressbar_box">
                {
                timeLineList.slice(timeLineList.length/2).map(item => (
                    <li
                      key={item.id}
                      className={cx("WorksCardListPanel__progressbar_step",
                        { active: item.id === curStage, upload: item.id === 2 },
                        {read: item.id === 3})}
                    >
                      {item.title}
                      <p className="date_tx">
                        {convertDateTime({ value: item.time, format: "MM-DD, HH:mm", isNull: '-' })}
                      </p>
                    </li>
                ))
                }
              </ul>
            </div>
          </Grid>
        </Grid>

        <Grid container className="WorksCardListPanel__row">
          <div className="WorksCard_memo">
            <div className="WorksCardListPanel__title">
              <span className="title">{`${mapper.sender}'s Memo`}</span>
              {isCurrentTypeSender && <button className="memo_edit_btn" onClick={() => handleClick({type: 'memo', name: 'edit'})}>edit</button>}
            </div>
            <div className="WorksCardListPanel__con">
              <div className="WorksCardMemo_cont">
                <HtmlConverter>{customSenderInfo.memo}</HtmlConverter>
              </div>
            </div>
          </div>
        </Grid>

        <Grid container className="WorksCardListPanel__row">
          <div className="WorksCard_memo">
            <div className="WorksCardListPanel__title">
              <span className="title">{`${mapper.receiver}'s Memo`}</span>
              {isCurrentTypeReceiver && <button className="memo_edit_btn" onClick={() => handleClick({type: 'memo', name: 'edit'})}>edit</button>}
            </div>
            <div className="WorksCardListPanel__con">
              <div className="WorksCardMemo_cont">
                <HtmlConverter>{customReceiverInfo.memo}</HtmlConverter>
              </div>
            </div>
          </div>
        </Grid>
        
      </Grid>
    </div>
  </>
  let rightCont = <>
    <div className="WorksCard_right_cont">
      <div className="WorksCard_case_cont">
        {/* sender area */}
        <CaseCardArea
          caseType={isSenderCase}
          info={customSenderInfo}
          handleClick={handleClick}
          type="sender"
          hasReceiver={valuesData.sender && valuesData.sender.company}
        />
      </div>
      <div className="WorksCard_case_cont">
        {/* receiver area */}
        <CaseCardArea
          caseType={isReceiverCase}
          info={customReceiverInfo}
          handleClick={handleClick}
          type="receiver"
          hasReceiver={valuesData.receiver && valuesData.receiver.company}
        />
      </div>
    </div>
  </>

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
                  content={isCurrentTypeSender ? customSenderInfo.memo : customReceiverInfo.memo}
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
      <PlainModal
        isOpen={values.isDeleteModal.isShow}
        content={
            values.isDeleteModal.type === 'alert'
            ? <ModalComplete
              title={values.isDeleteModal.title}
              children={values.isDeleteModal.subtitle}
              onClick={() => handleClick({ name: "delete_cancel" })}

            />
            :
            <ModalConfirmContent
              title={values.isDeleteModal.title}
              subtitle={values.isDeleteModal.subtitle}
              okClick={(value) => handleClick({ name: 'delete_ok'})}
              cancelClick={(value) => handleClick({name: "delete_cancel" })}
            />
        }
        dim={false}
        width={380}
      />

      <Styled.CaseCardDetail labelColor={labelConf && labelConf.color}>
        <SeparateTemplate 
          navTopCont={navTopCont}
          leftCont={leftCont}
          rightCont={rightCont}
        />
      </Styled.CaseCardDetail>
    </>
  );
})

const Styled = {
  CaseCardDetail: styled.div`
  .WorksCard_nav {
    display: flex;
    width: 100%;
    
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
  .WorksCard_left_cont {
    /* box-shadow: 1px 1px 4px rgba(36, 47, 53, 0.2);
    flex-basis: calc(32.3% - 5px);
    min-width: calc(32.3% - 5px);
    padding: 20px 30px; */

    .WorksCard_left_btn {
      text-align: right;
      margin-right: 20px;

      button {
        width: 30px;
        height: 30px;
        text-indent: -9999px;
        border: none;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;

        &.copy {
          background: url(${icon_works_detail_copy}) no-repeat center;
        }
        &.delete {
          background: url(${icon_works_detail_delete}) no-repeat center;
        }
        &.hidden {
          background: url(${icon_works_detail_hidden}) no-repeat center;
        }
        &.load {
          background: url(${icon_works_detail_load}) no-repeat center;
        }
      }

      button + button {
        margin-left: 10px;
      }
    }

    .WorksCardListPanel__info_box {
      margin-top: 20px;
    }
  }

  .WorksCard_right_cont {
    /* padding: 10px;
    box-shadow: 1px 1px 4px rgba(36, 47, 53, 0.2);
    flex-basis: calc(67.7% - 5px);
    min-width: calc(67.7% - 5px);
    margin-left: 10px; */

    .WorksCard_case_cont {
      border: 1px solid #E2E7EA;
      min-height: 460px;
    }
    .WorksCard_case_cont + .WorksCard_case_cont {
      margin-top: 10px;
    }
  }
  


  .WorksCardListPanel_btn{
    padding: 5px 10px;
    width: 60px;
    height: 30px;
    background: #98B8CB;
    ${font(16, color.white)};
    border-radius: 28px;
    border: none;
    transition: all .2s;
    cursor: pointer;
    margin-left: 15px;
  }

  .isShow{
    display:block
  }
  .isNotShow{
    display:none;
  }

  .WorksCardListPanel__row{
    &.ribbon{
      padding-bottom: 20px;
    }

    &.area_row{
      padding-bottom: 20px;
    }
  }

  .WorksCardListPanel__row + .WorksCardListPanel__row {
    margin-top: 25px;
  }

  .WorksCardListPanel__title{
    ${font(16, color.black_font)};
    font-weight: 600;
    line-height: 1;
    position:relative;

    &.indication{
      top:5px;
    }

    .memo_edit_btn {
      border: none;
      background: url(${icon_edit}) no-repeat center #00A6E2;
      width: 20px;
      height: 20px;
      cursor: pointer;
      text-indent: -9999px;
    }
  }
  .WorksCardListPanel__title_tx{
    margin-right:5px;
  }

  .WorksCardListPanel__con{
    ${font(16, color.gray_font)};
    line-height:1;
  }

  .WorksCardListPanel__progressbar {
    margin-top: 48px;
    width:100%;
  }
  .WorksCardListPanel__progressbar_box {
    width: 100%;
    margin: 0;
    padding: 0;
    ${font(14, color.disable_btn)};

  }

  .WorksCardListPanel__progressbar_box + .WorksCardListPanel__progressbar_box {
      display: flex;
      justify-content: flex-end;
      margin-top: 43px;

      .WorksCardListPanel__progressbar_step {
        &:last-child:after {
          display: none;
        }
        &:first-child::before {
          display: block;
        }
      }
    }

  .WorksCard_memo {
    flex: 1;
    max-width: 100%;

    .WorksCardListPanel__con {
      margin-top: 8px;
      
      .WorksCardMemo_cont {
        background-color: #FAFAFA;
        border: 1px solid #CACFD2;
        height: 130px;
        overflow-y: scroll;
        padding: 15px;
      }
    }

    .WorksCardListPanel__title{
      display: flex;
      justify-content: space-between;
    }
  }

 
 .WorksCardListPanel__progressbar_step{
    position: relative;
    display: inline-block;
    text-align: center;
    width:calc(100% / 4);


    &:before {
      content: '';
      position: absolute;
      display: block;
      background: ${color.disable_btn};
      width: 50%;
      height: 2px;
      top: -20px;
      right: 50%;
    }

    &:after {
      content: '';
      position: absolute;
      display: block;
      background: ${color.disable_btn};
      width: 50%;
      height: 2px;
      top: -20px;
      left: 50%;
    }
    
    &:first-child::before {
      display: none;
    }

    &.active {
      color: ${color.blue};
      
      .date_tx:before {
        background: ${color.blue};
      }

      /* &:after, */
      &:before {
        background: ${color.blue};
      }
    }

    .date_tx{
      padding-top: 5px;
      ${font(13, color.gray_font)};

      &:before {
        position:absolute;
        content: attr(data-step);
        display: block;
        background: ${color.disable_btn};
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 100%;
        z-index: 1000;
        left:50%;
        top:-30px;
        transform:translateX(-50%);
      }
   }
  }
    

   
  `
}
export default withRouter(CaseCardContainer);
