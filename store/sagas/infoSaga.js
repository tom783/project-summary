import {all, takeEvery,call} from 'redux-saga/effects';
import { AlertFn } from 'lib/library';
import { createPromiseSaga } from 'lib/utils';
import {
  INFO_CASE_UPDATE_SAGAS,
  INFO_CASE_CREATE_SAGAS,
  INFO_CASE_FILE_LIST_COUNT_SAGAS,
  INFO_PARTNERS_SAGAS,
  INFO_CASE_LOAD_SAGAS,
  INFO_INFORMATION_SAGAS,
  INFO_INFORMATION_UPDATE_SAGAS,
  INFO_UPDATE_MY_OPTION_SAGAS,
  INFO_CASE_INIT_DATA_SAGAS,
  INFO_CASE_DELETE_SAGAS,
  INFO_WORKS_DETAIL_SAGAS,
  INFO_PARTNERS_MODAL_INFO_SAGAS,
  MESSAGE_UPDATE_SAGAS,
  WORKSPACE_GET_SAGAS,
  WORKSPACE_SET_SAGAS,
  CHANGE_PROFILE_SAGAS,
  INFO_CASE_COMPLETE_SAGAS,
  INFO_WORKS_CASE_UPDATE_SAGAS,
  INFO_WORKS_APP_DATA_UPLOAD_SAGAS,
  INFO_WORKS_DIRECT_FILE_UPLOAD_SAGAS,
  INFO_WORKS_APP_DATA_DOWNLOAD_SAGAS,
  INFO_WORKS_DIRECT_FILE_DOWNLOAD_SAGAS,
  INFO_WORKS_CHECK_READ_SAGAS,
  INFO_WORKS_CHECK_DOWNLOAD_SAGAS,
  INFO_WORKS_DIRECT_FILE_DELETE_SAGAS,
  SHORTCUT_EXE_SAGAS,
  CASE_SYNC_SAGAS,
  INFO_WORKS_CARD_HIDE_SAGAS
} from 'store/actions';


/**
 * get country list
 * @param {*} param0 
 */
const handleCreateCase= createPromiseSaga({
  type:INFO_CASE_CREATE_SAGAS,
  tag:'handleCreateCase',
});



/**
 * 
 * @param {*} param0 
 */

const handleGetListCase= createPromiseSaga({
  type:INFO_CASE_FILE_LIST_COUNT_SAGAS,
  tag:'handleGetListCase',
});


/*
 * get mypage info
 * @param {*} param0 
 */
const handleGetMyinfo = createPromiseSaga({
  type: INFO_INFORMATION_SAGAS,
  tag: 'handleGetMyinfo',
});

/**
 * update mypage info
 * @param {*} param0 
 */
const handleUpdateMyinfo = createPromiseSaga({
  type: INFO_INFORMATION_UPDATE_SAGAS,
  tag: 'handleUpdateMyinfo',
});

/**
 * get mypage partner
 * @param {*} param0 
 */
const handleGetMyPartner = createPromiseSaga({
  type: INFO_PARTNERS_SAGAS,
  tag: 'handleGetMyPartner',
});

/**
 * get case load
 * @param {*} param0 
 */
const handleLoadCase= createPromiseSaga({
  type:INFO_CASE_LOAD_SAGAS,
  tag:'handleLoadCase',
});
/**
 * Case update
 * @param {*} param0 
 */

const handleUpdateCase= createPromiseSaga({
  type:INFO_CASE_UPDATE_SAGAS,
  tag:'handleUpdateCase',
});

/**
 * Works Case update
 * @param {*} param0 
 */
const handleWorksCaseUpdate= createPromiseSaga({
  type:INFO_WORKS_CASE_UPDATE_SAGAS,
  tag:'handleWorksCaseUpdate',
});

/**
 * Case Delete
 * @param {*} param0 
 */
const handleDeleteCase= createPromiseSaga({
  type:INFO_CASE_DELETE_SAGAS,
  tag:'handleDeleteCase',
});


/**
 * Case update
 * @param {*} param0 
 */

const handleGetCaseInitData= createPromiseSaga({
  type:INFO_CASE_INIT_DATA_SAGAS,
  tag:'handleGetCaseInitData',
});

/**
 * Works Detail
 * @param {*} param0 
 */

const handleGetWorksDetail= createPromiseSaga({
  type:INFO_WORKS_DETAIL_SAGAS,
  tag:'handleGetWorksDetail',
});


/**
 * option update
 * @param {*} param0 
 */
const handleUpdateOption = createPromiseSaga({
  type: INFO_UPDATE_MY_OPTION_SAGAS,
  tag: 'handleUpdateOption',
});

/**
 * option update
 * @param {*} param0 
 */
const handleGetMypartnerModal = createPromiseSaga({
  type: INFO_PARTNERS_MODAL_INFO_SAGAS,
  tag: 'handleGetMypartnerModal',
});

/**
 * message update
 * @param {*} param0 
 */
const handleUpdateMessage = createPromiseSaga({
  type: MESSAGE_UPDATE_SAGAS,
  tag: 'handleUpdateMessage',
});

/**
 * mypage option 작업경로 가져옴
 * @param {*} param0 
 */
const handleGetWorkspace = createPromiseSaga({
  type: WORKSPACE_GET_SAGAS,
  tag: 'handleGetWorkspace',
});

/**
 * mypage option 작업경로 변경
 * @param {*} param0 
 */
const handleSetWorkspace = createPromiseSaga({
  type: WORKSPACE_SET_SAGAS,
  tag: 'handleSetWorkspace',
});

/**
 * mypage modify 프로필 이미지 변경
 * @param {*} param0 
 */
const handleChangeProfile = createPromiseSaga({
  type: CHANGE_PROFILE_SAGAS,
  tag: 'handleChangeProfile',
});


/**
 * 케이스 완료
 * @param {*} param0 
 */

const handleCaseComplete= createPromiseSaga({
  type:INFO_CASE_COMPLETE_SAGAS,
  tag:'handleCaseComplete',
});

/**
 * Works 앱 데이트 업로드
 * @param {*} param0 
 */
const handleWorksAppDataUpload= createPromiseSaga({
  type:INFO_WORKS_APP_DATA_UPLOAD_SAGAS,
  tag:'handleWorksAppDataUpload',
});


/**
 * Works 앱 데이터 다운로드
 * @param {*} param0 
 */
const handleWorksAppDataDownload= createPromiseSaga({
  type:INFO_WORKS_APP_DATA_DOWNLOAD_SAGAS,
  tag:'handleWorksAppDataDownload',
});


/**
 * Works 다이렉트 파일 업로드
 * @param {*} param0 
 */

const handleWorksDirectFileUpload= createPromiseSaga({
  type:INFO_WORKS_DIRECT_FILE_UPLOAD_SAGAS,
  tag:'handleWorksDirectFileUpload',
});


/**
 * Works 다이렉트 파일 삭제
 * @param {*} param0 
 */
const handleWorksDirectFileDelete= createPromiseSaga({
  type:INFO_WORKS_DIRECT_FILE_DELETE_SAGAS,
  tag:'handleWorksDirectFileDelete',
});

/**
 * 웍스 다이렉트 파일 업로드
 * @param {*} param0 
 */

const handleWorksDirectFileDownload= createPromiseSaga({
  type:INFO_WORKS_DIRECT_FILE_DOWNLOAD_SAGAS,
  tag:'handleWorksDirectFileDownload',
});


/**
 * 일방적으로 보내기만하는 api saga
 * @param {*} param0 
 */
const handleCheckWorksRead= createPromiseSaga({
  type:INFO_WORKS_CHECK_READ_SAGAS,
  tag:'handleCheckWorksRead',
});


/**
 * 일방적으로 보내기만하는 api saga
 * @param {*} param0 
 */
const handleCheckWorksDownload= createPromiseSaga({
  type:INFO_WORKS_CHECK_DOWNLOAD_SAGAS,
  tag:'handleCheckWorksDownload',
});

/**
 * WorksList 카드를 하이드하는 요청
 */
const handleWorksCardHide= createPromiseSaga({
  type:INFO_WORKS_CARD_HIDE_SAGAS,
  tag:'handleWorksCardHide',
});


/**
 * 숏컷 업로드
 * @param {*} param0 
 */
function* handleUploadShortcut({payload}){
  AlertFn(handleUploadShortcut.name);
  SHORTCUT_EXE_SAGAS.pending();
  const {data, error} = yield call(SHORTCUT_EXE_SAGAS.request, payload);
  console.log(data,'!!!!SHORTCUT_EXE_SAGAS');
  if(data && !error){
      if(data.result === 1){
        SHORTCUT_EXE_SAGAS.success(data);
      }else{
        SHORTCUT_EXE_SAGAS.failure();
      }
  }else{
    SHORTCUT_EXE_SAGAS.failure();
  }
}

/**
 * 케이스 싱크
 * @param {*} param0 
 */
function* handleCaseSync({payload}){
  AlertFn(handleCaseSync.name);
  CASE_SYNC_SAGAS.pending();
  const {data, error} = yield call(CASE_SYNC_SAGAS.request, payload);
  console.log(data,'!!!!CASE_SYNC_SAGAS');
  if(data && !error){
      if(data.result === 1){
        CASE_SYNC_SAGAS.success(data);
      }else{
        CASE_SYNC_SAGAS.failure();
      }
  }else{
    CASE_SYNC_SAGAS.failure();
  }
}


export default function* InfoSaga(){
  yield all([
    takeEvery(INFO_CASE_CREATE_SAGAS.index,handleCreateCase),
    takeEvery(INFO_CASE_UPDATE_SAGAS.index,handleUpdateCase),
    takeEvery(INFO_CASE_DELETE_SAGAS.index,handleDeleteCase),
    takeEvery(INFO_CASE_FILE_LIST_COUNT_SAGAS.index,handleGetListCase),
    takeEvery(INFO_CASE_LOAD_SAGAS.index, handleLoadCase),
    takeEvery(INFO_INFORMATION_SAGAS.index, handleGetMyinfo),
    takeEvery(INFO_INFORMATION_UPDATE_SAGAS.index, handleUpdateMyinfo),
    takeEvery(INFO_PARTNERS_SAGAS.index, handleGetMyPartner),
    takeEvery(INFO_CASE_INIT_DATA_SAGAS.index, handleGetCaseInitData),
    takeEvery(INFO_UPDATE_MY_OPTION_SAGAS.index, handleUpdateOption),
    takeEvery(INFO_WORKS_DETAIL_SAGAS.index, handleGetWorksDetail),
    takeEvery(INFO_PARTNERS_MODAL_INFO_SAGAS.index, handleGetMypartnerModal),
    takeEvery(MESSAGE_UPDATE_SAGAS.index, handleUpdateMessage),
    takeEvery(WORKSPACE_GET_SAGAS.index, handleGetWorkspace),
    takeEvery(WORKSPACE_SET_SAGAS.index, handleSetWorkspace),
    takeEvery(CHANGE_PROFILE_SAGAS.index, handleChangeProfile),
    takeEvery(INFO_CASE_COMPLETE_SAGAS.index, handleCaseComplete),
    takeEvery(INFO_WORKS_CASE_UPDATE_SAGAS.index, handleWorksCaseUpdate),
    takeEvery(INFO_WORKS_APP_DATA_UPLOAD_SAGAS.index, handleWorksAppDataUpload),
    takeEvery(INFO_WORKS_APP_DATA_DOWNLOAD_SAGAS.index, handleWorksAppDataDownload),
    takeEvery(INFO_WORKS_DIRECT_FILE_UPLOAD_SAGAS.index, handleWorksDirectFileUpload),
    takeEvery(INFO_WORKS_DIRECT_FILE_DOWNLOAD_SAGAS.index, handleWorksDirectFileDownload),
    takeEvery(INFO_WORKS_DIRECT_FILE_DELETE_SAGAS.index, handleWorksDirectFileDelete),
    takeEvery(INFO_WORKS_CHECK_READ_SAGAS.index, handleCheckWorksRead),
    takeEvery(INFO_WORKS_CHECK_DOWNLOAD_SAGAS.index, handleCheckWorksDownload),
    takeEvery(SHORTCUT_EXE_SAGAS.index, handleUploadShortcut),
    takeEvery(CASE_SYNC_SAGAS.index, handleCaseSync),
    takeEvery(INFO_WORKS_CARD_HIDE_SAGAS.index, handleWorksCardHide),
  ])
}










// function* handleGetMyPartner({payload}){
//   roleSaga(INFO_CASA_FILE_LIST_COUNT_SAGAS)
//   .success(function(res){
//     alert('성공 했습니다.')
//   })
//   .failure(function(res){
//     alert('실패 했습니다.')
//   })
// }