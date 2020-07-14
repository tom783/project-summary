import {all, takeEvery,call, take} from 'redux-saga/effects';
import { AlertFn} from 'lib/library';
import { createPromiseSaga } from 'lib/utils';
import {
  COMMON_EXE_NAV_SUBMIT_SAGAS
} from 'store/actions';

// import {Actions} from 'store/actionCreators'


/**
 * get country list
 * @param {*} param0 
 */

const handleExeNavSumibt= createPromiseSaga({
  type:COMMON_EXE_NAV_SUBMIT_SAGAS,
  tag:'handleExeNavSumibt',
});

export default function* commonSaga(){
  yield all([
    takeEvery(COMMON_EXE_NAV_SUBMIT_SAGAS.index,handleExeNavSumibt),

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