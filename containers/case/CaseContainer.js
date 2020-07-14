import React, { useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Actions } from 'store/actionCreators';
import { useImmer } from 'use-immer';
import { CasePanel } from 'components/common/panel';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ENV_MODE_DEV } from 'lib/setting';
import { CaseCardLeft, CaseInfoTopCard, } from 'components/common/card';
import { CustomLoadingCircle } from 'components/base/loading';
import {SeparateTemplate} from 'components/base/template';
import { CustomTooltip } from 'components/common/tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import {
  log,
  makeCaseID,
  fixedNumbering,
  convertDateTime,
} from 'lib/library';
import {
  PlainModal,
  ModalPartnerChangeContent,
  ModalCaseListContent,
  ModalComplete,
} from 'components/common/modal';
import {
  INFO_CASE_CREATE_SAGAS,
  INFO_CASE_UPDATE_SAGAS,
  INFO_CASE_LOAD_SAGAS,
  INFO_CASE_INIT_DATA_SAGAS,
} from 'store/actions';



const CaseContainerState = {
  caseId: "",
  dueDate: moment().unix(),
  userCode: "",
  senderName: "",
  senderCode: "",
  receiverCode: "",
  patient: "",
  caseCode: "",
  caseCount: "",
  stage: "",
  readType: "",
  partner: {
    title: "",
    id: "",
    phone: "",
    company: "",
    manager: "",
    name: "",
    country: "",
    states: "",
  },
  modal: {
    dim: true,
    isOpen: false,
    current: false,
    load: false,
    create: false,
    cloud: false
  },
  load: {
    success: false,
  },
  create: {
    success: false
  },
  indication: null,
  cloudBtn: {
    disable: true,
    isShow: true,
  },
  memo: {
    senderMemo: "",
    receiverMemo: ""
  },
  responsibilityList: [],
  responsibility: ""
}


const CaseContainer = React.memo(function CaseContainer() {
  const [values, setValue] = useImmer(CaseContainerState);
  const { authReducer, infoReducer } = useSelector(
    ({ auth, info }) => ({ authReducer: auth, infoReducer: info })
  );

  const rAuthSignin = authReducer.signIn;
  const rInfoCase = infoReducer.case;
  const rAuthCompanyName = rAuthSignin.profile.company;
  const rAuthUserCode = rAuthSignin.profile.userCode;
  const isRCaseData = rInfoCase.data;
  const rCaseCaseCount = isRCaseData.caseCount;
  const rCaseCaseType = rInfoCase.type;
  const isLoadPendingOrInitPending = rInfoCase.load.pending || rInfoCase.init.pending;
  const isRCaseCreateSuccess = rInfoCase.create.success;
  const isRCaseUpdateSuccess = rInfoCase.update.success;
  const isRCaseInitSuccess = rInfoCase.init.success
  const isRCaseLoadSuccess = rInfoCase.load.success
  const isRInfoCaseCreateFailure = rInfoCase.create.failure;
  const isRInfoCaseUpdateFailure = rInfoCase.update.failure;
  const { modal } = values;
  const hasModalDim = modal.dim;
  const currentModalName = modal.current;
  const bottomTooltip = "test"

  // NOTE: default Observable update state values
  let defaultConfig = {
    caseId: values.caseId,
    senderCode: values.senderCode,
    senderName: values.senderName,
    receiverCode: values.partner.id,
    receiverName: values.partner.name,
    partner: values.partner,
    patient: values.patient.trim(),
    receiverManager: values.partner.manager,
    receiverCompany: values.partner.company,
    dueDate: values.dueDate,
    indication: values.indication,
    userCode: values.userCode,
    stage: values.stage,
    caseCode: values.caseCode,
    type: values.readType,
    responsibility: values.responsibility,
    senderMemo: values.memo.senderMemo,
    receiverMemo: values.memo.receiverMemo,
    senderManager: values.senderManager,
    rCaseCaseCount
  };
  const isDueDateNanValue = isNaN(defaultConfig.dueDate);

  // NOTE: Case change event
  /**
   * 
   * @param {object} config 
   */
  const handleChange = config => {
    const { type = "", value = "" } = config;
    const isPatientChange = type === 'patient';
    const isSenderNameChange = type === 'senderName';
    const isManagerChange = type === 'responsibility';
    const isCaseIdChange = type === 'caseId';
    const isDueDateChange = type === 'dueDate';
    setValue(draft => {
      if (isCaseIdChange || isPatientChange) {
        const companyName = rAuthCompanyName ? `-${rAuthCompanyName}` : '';
        const patientName = value.length ? `-${value}-` : `-${value}`;
        const convertDateUnixToString = convertDateTime({
          value: defaultConfig.dueDate,
          format: "YYYYMMDD"
        });
        draft.caseId = makeCaseID({
          date: convertDateUnixToString,
          company: companyName,
          patient: patientName,
          numbering: fixedNumbering(values.caseCount, 4),
        });
        draft[type] = value;
      }
      if (isDueDateChange) draft[type] = value;
      if (isSenderNameChange) draft.senderName = value;
      if (isManagerChange) draft.responsibility = value;
      draft.cloudBtn.disable = true;
    });
  }

  // NOTE: case Click event
  /**
   * 
   * @param {string} value 
   * @param {object} e event object
   */
  const handleClick = value => e => {
    const isNewCaseMode = value === 'new';
    const isLoadMode = value === 'load';
    const isPartnerChangeButton = value === 'partners';
    const isModalDimClick = value === 'dim';

    if (isNewCaseMode) {
      Actions.info_case_init();
      setValue(() => CaseContainerState);
      initialize({ type: 'init' });
    } else {
      setValue(draft => {
        if (isLoadMode) {
          draft.modal.current = value;
          draft.modal.isOpen = true;
        }
        if (isPartnerChangeButton) {
          draft.modal.current = value;
          draft.modal.isOpen = true;
        }
        if (isModalDimClick) {
          draft.modal.isOpen = false;
        }
      });
    }
  }


  // NOTE: case submit event
  /**
   * 
   * @param {*} value 
   * @param {object} config
   */
  const handleSubmit = value => config => {
    const { name = "", panel = {} } = value;
    const isChangePartner = value === 'changePartner';
    const isCaseLoadData = value === 'caseLoadData';
    const isCaseUpdate = name === 'update';
    const isCaseCreate = name === 'create';
    const isCaseModifyMode = name === 'modify';

    if (isChangePartner) {
      const changeInfo = config.companySelected;
      setValue(draft => {
        draft.partner.title = changeInfo.companyName;
        draft.partner.company = changeInfo.companyName;
        draft.partner.id = changeInfo.value;
        draft.partner.manager = changeInfo.manager;
        draft.partner.name = changeInfo.name;
        draft.receiverCode = changeInfo.value;
        draft.partner.phone = changeInfo.phone || '';
        draft.partner.country = changeInfo.country || '';
        draft.partner.states = changeInfo.states || '';
        draft.modal.isOpen = false;
      });
    }
    if (isCaseLoadData) {
      const loadConfig = {
        caseCode: config,
        userCode: rAuthUserCode
      }
      INFO_CASE_LOAD_SAGAS(loadConfig);
    }
    if (isCaseCreate && !isDueDateNanValue) {
      const createObj = {
        ...defaultConfig,
        senderMemo: panel.sender.editor.content,
      }
      log(createObj, 'createObj');
      INFO_CASE_CREATE_SAGAS(createObj)
    }
    if (isCaseUpdate && !isDueDateNanValue) {
      const updateObj = {
        ...defaultConfig,
        senderMemo: panel.sender.editor.content,
        receiverMemo: panel.receiver.editor.content,
      }
      INFO_CASE_UPDATE_SAGAS(updateObj);
    }
    if (isCaseModifyMode) {
      Actions.info_case_type_change({ type: "modify" });
    }
  }

  // NOTE: init & load function
  /**
   * 
   * @param {object} config 
   */
  const initialize = config => {
    const type = config.type;
    const isLoadType = type === 'load';
    if (isLoadType) {
      const {
        caseId,
        patient,
        dueDate,
        receiverCompany,
        senderMemo,
        receiverMemo,
        caseCode,
        receiverManager,
        receiverCode,
        receiverName,
        receiverPhone,
        receiverStates,
        receiverCountry,
        senderName,
        senderCode,
        type,
        stage,
        caseCount,
      } = isRCaseData;

      setValue(draft => {

        draft.caseCount = caseCount;
        draft.cloudBtn.isShow = false;
        draft.modal.isOpen = false;
        draft.modal.dim = true;
        draft.caseId = caseId;
        draft.patient = patient;
        draft.dueDate = dueDate;
        draft.partner.manager = receiverManager;
        draft.partner.title = receiverCompany;
        draft.partner.company = receiverCompany;
        draft.partner.id = receiverCode;
        draft.partner.name = receiverName;
        draft.partner.phone = receiverPhone;
        draft.partner.country = receiverCountry;
        draft.partner.states = receiverStates;
        draft.memo.senderMemo = senderMemo;
        draft.memo.receiverMemo = receiverMemo;
        draft.receiverCode = receiverCode;
        draft.senderCode = senderCode;
        draft.senderName = senderName;
        draft.caseCode = caseCode;
        draft.stage = stage;
        draft.userCode = rAuthUserCode;
        draft.readType = type;

      });
      Actions.base_scrollbars_control({ type: 'update', name: "reset" });
    } else {
      INFO_CASE_INIT_DATA_SAGAS({ userCode: rAuthUserCode, type: "init" });
    }
  }
  // NOTE: case modify & create & nit get data
  useEffect(() => {
    const isInitCond = isRCaseInitSuccess && !isRCaseCreateSuccess && !isRCaseUpdateSuccess;
    if (isInitCond) {
      const moDate = moment.unix(defaultConfig.dueDate).format(`YYYYMMDD`);
      const comName = rAuthCompanyName ? `-${rAuthCompanyName}-` : '-';
      setValue(draft => {

        draft.caseCount = rCaseCaseCount;
        draft.caseId = `${moDate}${comName}${fixedNumbering(rCaseCaseCount, 4)}`;
        draft.userCode = rAuthUserCode;
        draft.senderCode = rAuthUserCode;
        draft.partner.title = isRCaseData.company; // partner 회사
        draft.partner.id = isRCaseData.code;
        draft.partner.manager = isRCaseData.manager;
        draft.partner.phone = isRCaseData.phone;
        draft.partner.company = isRCaseData.company;
        draft.partner.country = isRCaseData.country;
        draft.partner.states = isRCaseData.states;
        draft.receiverCode = isRCaseData.code;
        draft.responsibility = isRCaseData.responsibility || "";

      });
    }

    if (isRCaseCreateSuccess) {
      setValue(draft => {
        draft.cloudBtn.disable = false;
        draft.caseId = isRCaseData.caseId;
        draft.modal.current = 'create';
        draft.modal.isOpen = true;
        draft.modal.dim = false;
        draft.caseCode = isRCaseData.caseCode;
      });
    }
    if (isRCaseUpdateSuccess) {
      setValue(draft => {
        draft.cloudBtn.disable = false;
        draft.modal.current = 'update';
        draft.modal.isOpen = true;
        draft.modal.dim = false;
      });
    }
    if (!isRCaseCreateSuccess || !isRCaseUpdateSuccess) {
      setValue(draft => {
        draft.cloudBtn.disable = true;
      });
    }
  }, [isRCaseUpdateSuccess, isRCaseCreateSuccess, isRCaseInitSuccess]);

  // NOTE: case update failure
  // DEBUG: 케이스 생성 실패시 처리 방안 논의 필요
  useEffect(() => {
    if (isRInfoCaseCreateFailure) alert('생성에 실패하였습니다.');
    if (isRInfoCaseUpdateFailure) alert('업로드에 실패하였습니다.');
  }, [isRInfoCaseUpdateFailure, isRInfoCaseCreateFailure]);

  // NOTE: case load
  useEffect(() => {
    if (isRCaseLoadSuccess) initialize({ type: "load" });
  }, [isRCaseLoadSuccess]);

  // NOTE: case init
  useEffect(() => {
    if (!isRCaseLoadSuccess) initialize({ type: "init" });
    return () => Actions.info_case_init();
  }, []);

  // NOTE: 재가공하여 프리젠테이션으로 전달해 줄 오브젝트 입니다.
  const caseData = {
    ...defaultConfig,
    manager: isRCaseData.manager,
    responsibility: isRCaseData.responsibility,
    responsibilityList: isRCaseData.responsibilityList
  }

  // NOTE: modal associate function
  const modalInfo = ModalController(currentModalName)(
    { values, fn: handleSubmit, userCode: rAuthUserCode, handleClick:handleClick }
  ) || {};

  const hasModalInfoType    = modalInfo.type;
  const hasModalInfoContent = modalInfo.content;
  const hasModalInfoWidth   = modalInfo.width;

  // DEBUG: 개발 확인용 콘솔
  if(ENV_MODE_DEV){
    if (isRCaseInitSuccess || isRCaseLoadSuccess) log('CasePage render Data', caseData);
  }

  let nevTitle = <Styled.Case_nav>
    <div className="Case_nav_label">
      <div className="Case_nav_caseId">
        {caseData && caseData.caseId}
      </div>
    </div>
    <div className="Case_nav_btn">
      <button
        onClick={handleClick('new')}
      >
        NEW CASE
      </button>
      <button
        onClick={handleClick('load')}
      >
        CASE LOAD
      </button>
    </div>
  </Styled.Case_nav>

  let caseBottom = <Styled.Case_bottom>
    <div className="bottom_cont">
      <div className="patient_share_box">
        <CustomTooltip
            type="help"
            title={bottomTooltip}
            placement="top-start"
            interactive={false}
            baseStyle
          />
        <label htmlFor="patient_share">
        환자정보 공유하기
        </label>
        <Checkbox 
          id="patient_share"
        />
      </div>
      <button className="btn cancel">
        CANCEL
      </button>
      <button className="btn save">
        SAVE
      </button>
    </div>
  </Styled.Case_bottom>

  return (
    <>
      <PlainModal
        type={hasModalInfoType}
        isOpen={modal.isOpen}
        onClick={handleClick('dim')}
        content={hasModalInfoContent}
        width={hasModalInfoWidth}
        dim={hasModalDim}
      />
      {isLoadPendingOrInitPending
        ? <WorksWhiteLoading />
        : <>
          <SeparateTemplate 
            navTopCont={nevTitle}
            leftCont={<CaseCardLeft
              onClick={handleClick}
              onChange={handleChange}
              info={caseData}
              type={rCaseCaseType}
              profile={rAuthSignin.profile}
              partnerInfo={values.partnerInfo}
              onSubmit={handleSubmit}
            />}
            rightCont={"test"}
          />
          {caseBottom}
          {/* <CaseInfoTopCard
            onClick={handleClick}
            onChange={handleChange}
            info={caseData}
            type={rCaseCaseType}
            profile={rAuthSignin.profile}
            partnerInfo={values.partnerInfo}
          />
          <CasePanel
            onClick={handleClick}
            onChange={handleChange}
            onSubmit={handleSubmit}
            caseMode={rCaseCaseType}
            values={values}
            info={caseData}
            profile={rAuthSignin.profile}
          /> */}
        </>}
    </>
  );
});

// NOTE: Case에서 사용하는 modal 모음 함수
/**
 * 
 * @param {string} type 
 * @param {object} config
 */
const ModalController = type => config => {
  const { values = "", fn = () => { }, userCode = "", handleClick=() => {} } = config;
  const caseCode = values.caseCode;
  const modalObj = {
    load: {
      type: "caseLoad",
      content: <ModalCaseListContent onSubmit={fn("caseLoadData")} onCancle={handleClick('dim')} />,
      width: 960,
    },
    create: {
      type: "Create",
      content:
        <ModalComplete
          title={"케이스 생성 완료"}
          children={'케이스가 생성되었습니다. \n 케이스 진행사항은 Works에서 확인할 수 있습니다.'}
          onClick={() => {
            INFO_CASE_CREATE_SAGAS.init();
            INFO_CASE_LOAD_SAGAS({ caseCode, userCode });
          }}
        />,
      width: 450
    },
    cloud: {
      type: "Cloud",
      content: "Cloud",
      width: null
    },
    partners: {
      type: 'partners',
      content: <ModalPartnerChangeContent onSubmit={fn('changePartner')} onCancle={handleClick('dim')}  />,
      width: 750
    },
    update: {
      type: "update",
      content:
        <ModalComplete
          title={"업데이트 완료"}
          children={'업데이트가 완료되었습니다.'}
          onClick={() => {
            INFO_CASE_UPDATE_SAGAS.init();
            INFO_CASE_LOAD_SAGAS({ caseCode, userCode });
          }}
        />,
      width: 450
    }
  };
  return modalObj[type];
}

const WorksWhiteLoading = () =>
  <Styled.WorksWhite >
    <div className="works__loading">
      <CustomLoadingCircle />
    </div>
  </Styled.WorksWhite>;

export default withRouter(CaseContainer);

const Styled = {
  WorksWhite: styled.div`
    position:relative;
    min-height:71vh;
    .works__loading{
      z-index:1;
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      color:red;
    }
  `,
  Case_nav: styled.div`
    display: flex;
    width: 100%;
    
    .Case_nav_btn {
      margin-left: 20px;
      button {
        position: relative;
        width: 150px;
        height: 50px;
        background-color: #00A6E2;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        border: none;
        cursor: pointer;
      }
      button + button {
        margin-left: 5px;
      }
    }

    .Case_nav_label {
      position: relative;
      display: flex;
      flex: 1;
      box-shadow: 1px 1px 4px rgba(36, 47, 53, 0.2);
      justify-content: space-between;
      align-items: center;
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

      .Case_nav_caseId {
        color: #242F35;
        font-size: 18px;
      }
    }
  `,
  Case_bottom: styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;

    .bottom_cont {
      display: flex;
      align-items: center;

      .patient_share_box {
        display: flex;
        align-items: center;
        margin-right: 20px;

        label {
          font-size: 16px;
          color: #313136;
          margin-right: 10px;
        }

        .PrivateSwitchBase-root-462 {
          padding: 0;
        }
        
      }

      .btn {
        display: inline-block;
        width: 150px;
        height: 45px;
        line-height: 41px;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        border: none;
        cursor: pointer;
        
        &.cancel {
          color: #00a6e2;
          border: 2px solid #00a6e2;
          background-color: #fff;
        }

        &.save {
          color: #fff;
          background-color: #00a6e2;
        }
        
      }

      .btn + .btn {
        margin-left: 5px;
      }
    }
  `,
}


