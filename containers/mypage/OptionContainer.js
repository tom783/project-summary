import React, {useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useImmer} from 'use-immer';
import {useDidUpdateEffect} from 'lib/utils';
import {OptionPage} from 'components/common/info';
import { PlainModal, ModalWorkSpaceChange } from 'components/common/modal';

import {mapper} from 'lib/mapper';

import { useTranslation } from "react-i18next";


import {
  // WORKSPACE_GET_SAGAS,
  WORKSPACE_SET_SAGAS,
  CASE_SYNC_SAGAS
} from 'store/actions';

const {HANDLEEVENTTYPE} = mapper;

const initValue = {
  workSpace: 'test/default/path',
  syncTime: '2020-03-03 16:29:42',
  syncPending: false,
  modal: {
    current: null,
    workSpace: false,
  }
}

function OptionContainer(props) {
  const [value, setValue] = useImmer(initValue);
  const {
    mypage: mypageReducer,
    base: baseReducer,
  } = useSelector(state => state);

  const {
    workSpace: rWorkSpace,
    workSpaceSet: rWorkSpaceSet,
    caseSync: rCaseSync
  } = mypageReducer;

  const {language: rLanguage} = baseReducer;

  const {i18n} = useTranslation(); // 다국어 변환


  // 클릭 이벤트 관리
  const handleClick = useCallback(config => e => {
    const {
      type,
    } = config;
    // 작업 경로 변경 버튼 클릭시 변경 모달 활성화
    if(type === HANDLEEVENTTYPE.workspaceModal){
      openModal('workSpace');
    }

    // 작업 경로 변경 완료 버튼 클릭시
    if(type === HANDLEEVENTTYPE.updateWorkSpace){
      // console.log("update workspace", e);
      // workSpace 모달 재요청으로 모달이 닫아짐
      openModal('workSpace');
      // e 에는 target value가 들어있음. 
      // WORKSPACE_SET_SAGAS();
    }
    // 싱크 버튼 클릭시
    if(type === HANDLEEVENTTYPE.sync){
      // console.log("sync");
      // CASE_SYNC_SAGAS();
    }
  },[]);

  // 옵션 컨테이너 모달 관리
  const openModal = useCallback(value => {
    // console.log("open modal", value);
    if(value === 'workSpace'){
      setValue(draft => {
        draft.modal.workSpace = !draft.modal.workSpace;
        draft.modal.current = 'workSpace';
      })
    }
  },[]);

  const typeModalCurrent = value.modal.current;
  const typeModalBool = !!value.modal[typeModalCurrent];
  const fnOpenModal = useCallback(()=>openModal( typeModalCurrent),[typeModalCurrent]);

  const modalObj={
    'workSpace': <ModalWorkSpaceChange handleClick={handleClick}/>,
  };
  const modalContent = modalObj[typeModalCurrent];

  useEffect(() => {
    // 아직 api 나오지 않음.2020.02.27
      // WORKSPACE_GET_SAGAS();
      props.routeHistory();
  },[]);

  useEffect(() => {
    // 작업 경로 정보 요청 성공시
    if(rWorkSpace.success){
      setValue(draft => {
        draft.workSpace = rWorkSpace.path;
      });
    }
    // 작업 경로 변경 요청 성공시
    if(rWorkSpaceSet.success){
    // 아직 api 나오지 않음.2020.02.27
      // WORKSPACE_GET_SAGAS();
      // WORKSPACE_SET_SAGAS.init();
    }
    
  },[rWorkSpace.success, rWorkSpaceSet.success]);

  useEffect(() => {
    // 싱크 요청 성공시
    if(rCaseSync.success){
      setValue(draft => {
        draft.syncTime = rCaseSync.syncTime;
        draft.syncPending = false;
      });
    }else{
      setValue(draft => {
        draft.syncPending = false;
      });
    }

    // 싱크 요청 펜딩 시
    if(rCaseSync.pending){
      setValue(draft => {
        draft.syncPending = true;
      });
    }
  },[rCaseSync.success, rCaseSync.pending]);

  useEffect(() => {
    if(rCaseSync.failure){
      // openModal();
    }

  }, [rCaseSync.failure]);

  // useDidUpdateEffect(() => {
  //   i18n.changeLanguage(rLanguage);
  // }, [rLanguage]);

  return (
    <div>
      {true &&
      // {workSpace.success?
      <OptionPage 
        handleClick={handleClick}
        workSpace={value.workSpace}
        syncTime={value.syncTime}
        syncPending = {value.syncPending}
        rLanguage={rLanguage}
      />
      
      }
      <PlainModal
        isOpen={typeModalBool}
        content={modalContent}
        onClick={fnOpenModal}
        dim={true}
        width={'360px'}
      />
    </div>
  );
}

export default OptionContainer;