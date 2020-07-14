import { all, takeEvery } from 'redux-saga/effects';
import { createPromiseSaga } from 'lib/utils';
import {
  GET_INDICATION_FORMAT_SAGAS,
  BASE_INDICATION_ADD_SAGAS
} from 'store/actions';

/**
 * 
 * @param {*} param0 
 */
const handleGetIndicationFormat = createPromiseSaga({
  type: GET_INDICATION_FORMAT_SAGAS,
  tag: 'handleGetIndicationFormat',
});



const handlePostIndicationAdd = createPromiseSaga({
  type: BASE_INDICATION_ADD_SAGAS,
  tag: 'handleGetIndicationFormat',
});


export default function* baseSaga() {
  yield all([
    takeEvery(GET_INDICATION_FORMAT_SAGAS.index, handleGetIndicationFormat),
    takeEvery(BASE_INDICATION_ADD_SAGAS.index, handlePostIndicationAdd),
  ])
}