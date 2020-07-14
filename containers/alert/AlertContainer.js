import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import { useDidUpdateEffect } from 'lib/utils';
import {storage} from 'lib/library';
import { AlertList } from 'components/common/listing';
import Checkbox from '@material-ui/core/Checkbox';
import { font, color } from 'styles/__utils';
import cx from 'classnames';
import styled from 'styled-components';
import CachedIcon from '@material-ui/icons/Cached';
import { PlainModal, ModalComplete } from 'components/common/modal';
import {withRouter} from 'react-router-dom';
import {FullScreenLoading } from 'components/base/loading';
import { ArrowPageContainer } from 'containers/pagination';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


import {
  MESSAGE_LIST_SAGAS,
  MESSAGE_LIST_DELETE_SAGAS,
  MESSAGE_UPDATE_SAGAS,
  MESSAGE_LIST_READ_SAGAS,
  LISTING_WORKS_SEARCH_SAGAS,
} from 'store/actions';

import {mapper} from 'lib/mapper';
const {HANDLEEVENTTYPE} = mapper;

const initState = {
  page: 1,
  checkEventId: {},
  allCheckBox: false,
  count: 1,
  modal: {
    current: null,
    open: false,
  },
  caseCode: '',
  list: [],
  pageData: {
    isEndNextPage: false,
    isEndPrevPage: false
  },

};

function AlertContainer(props) {
  const {
    auth: authReducer, 
    listing: listReducer, 
    info: infoReducer 
  } = useSelector(state => state);
  const {
    userCode : rUserCode
  } = authReducer.signIn.profile;
  const {
    list : rList,
    pagingData : rPagingData,
  } = listReducer.message;
  const {
    messageUpdate : rMessageUpdate,
  } = infoReducer;

  const [values, setValues] = useImmer(initState);

  // const searchPage = listReducer.message.pagingData;
  // const isEndPrevPage = !searchPage.prevCheck;
  // const isEndNextPage = !searchPage.nextCheck;

  const getUrlpage = props.match.params.list;
  const searchConfig = {
    userCode: rUserCode,
    page: getUrlpage,
  }

  // 체크박스 전체 싱글 선택 관리
  /**
   * config : {"type": string}
   */
  const handleCheck = useCallback(config => e => {
    const {
      type
    } = config;
    const isChecked = e.target.checked;
    const checkboxValue = e.target.value;

    if (type === HANDLEEVENTTYPE.allSelect) {
      let copyCheckEventId = {};
      rList.forEach(i => {
        const {eventLogIdx} = i;
        copyCheckEventId[eventLogIdx] = isChecked ? true : false;
      });
      setValues(draft => {
        draft.allCheckBox = !draft.allCheckBox;
        draft.checkEventId = copyCheckEventId;
      });
    }
    if (type === HANDLEEVENTTYPE.singleSelect) {
      setValues(draft => {
        draft.checkEventId[checkboxValue] = isChecked;
      });
    }

  },[rList]);

  // 클릭 이벤트 관리
  /**
   * config : {"type": string, "partnerCode": string, "caseCode": string}
   */
  const handleClick = useCallback(config => e => {
    const {
      type,
      partnerCode,
      caseCode
    } = config;

    setValues(draft => {
      draft.allCheckBox = false;
    });
    // 메세지 삭제
    if (type === HANDLEEVENTTYPE.deleteMessage) {
      let deletArry = [];
      Object.keys(values.checkEventId).forEach(i => {
        if (values.checkEventId[i] === true) {
          return deletArry.push(i);
        }
      });
      MESSAGE_LIST_DELETE_SAGAS({ userCode: rUserCode, eventLogIdxArr: deletArry });
    }

    // 메세지 읽기
    if (type === HANDLEEVENTTYPE.readMessage) {
      let readArray = [];
      Object.keys(values.checkEventId).forEach(i => {
        if (values.checkEventId[i] === true) {
          return readArray.push(i);
        }
      });
      MESSAGE_LIST_READ_SAGAS({ userCode: rUserCode, eventLogIdxArr: readArray });
    }

    // 요청 메세지 수락
    if (type === HANDLEEVENTTYPE.acceptProject) {
      setValues(draft => {
        draft.modal.current = 'accept';
      });
      MESSAGE_UPDATE_SAGAS({ userCode: rUserCode, partnerCode: partnerCode, state: 1 });
    }

    // 요청 메세지 거절
    if (type === HANDLEEVENTTYPE.denyProject) {
      setValues(draft => {
        draft.modal.current = 'deny';
      });
      MESSAGE_UPDATE_SAGAS({ userCode: rUserCode, partnerCode: partnerCode, state: 2 });
    }

    // 메세지 리스트 리프레쉬
    if (type === HANDLEEVENTTYPE.refresh) {
      MESSAGE_LIST_SAGAS(apiMessageConf);
    }

    // 링크 메세지 클릭시 works로 이동
    if (type === HANDLEEVENTTYPE.link) {
      const worksSearchConf = {
        userCode: rUserCode,
        page: 1,
        sort: 5,
        search: caseCode,
        filter:{
          stage:[0],
          type:["sender", "receiver"],
          hidden:[]
        },
        first:false,
        isLoad:true
      }
      setValues(draft => {
        draft.caseCode = caseCode;
      });
      LISTING_WORKS_SEARCH_SAGAS(worksSearchConf);
    }
  },[values.checkEventId]);

   // 모달 닫기
   const closeModal = useCallback(() => {
    // console.log("close modal");
    setValues(draft => {
      draft.modal.current = null;
      draft.modal.open = false;
    });
  },[]);

  const modalObj = {
    'accept': <ModalComplete onClick={() => closeModal()} title="수락완료" children="파트너 요청을 수락했습니다." />,
    'deny': <ModalComplete onClick={() => closeModal()} title="거절완료" children="파트너 요청을 거절했습니다." />,
  }
  const modalCont = modalObj[values.modal.current];

  const apiMessageConf = {
    page: values.page,
    userCode: rUserCode,
  }
  const afterUpdateConf = {
    page: getUrlpage,
    userCode: rUserCode
  }

  // 페이지 렌더링 시 메세지 리스트 요청
  useEffect(() => {
    MESSAGE_LIST_SAGAS(apiMessageConf);
    setValues(draft => {
      draft.modal.open = false;
      draft.modal.current = null;
    });
  }, []);

  // 메세지 리스트 요청 성공시 체크박스 초기화
  useDidUpdateEffect(() => {
    if (listReducer.message.success) {
      let copyCheckEventId = {}
      rList.forEach(i => {
        const {eventLogIdx} = i;
        copyCheckEventId[eventLogIdx] = false;
      });

      setValues(draft => {
        draft.list = rList;
        draft.pageData.isEndNextPage = !rPagingData.nextCheck;
        draft.pageData.isEndPrevPage = !rPagingData.prevCheck;
        draft.checkEventId = copyCheckEventId;
      });
    }
    setValues(draft => {
      draft.allCheckBox = false;
    });
  }, [listReducer.message.success]);

  // 메세지 read, delete 이벤트 성공시 메세지 리스트 요청
  useDidUpdateEffect(() => {
    if (listReducer.message.update.success) {
      MESSAGE_LIST_SAGAS(afterUpdateConf);
    }
  }, [listReducer.message.update.success]);

  // 요청 메세지 accept deny 이벤트 성공시 메세지 리스트 요청 및 모달 활성화 대기
  useDidUpdateEffect(() => {
    if (rMessageUpdate.success) {
      MESSAGE_LIST_SAGAS(apiMessageConf);
      setValues(draft => {
        draft.modal.open = true;
      });
    }
  }, [rMessageUpdate.success]);

  // works 페이지 이동요청 시
  const isSuccessSearch = listReducer.works.success;
  useEffect(()=>{
    if(isSuccessSearch && listReducer.works.search.isLoad){
      props.history.push(`/works/1?sort=5&search=${values.caseCode}&type=`);
      
      // 페이지 이동시 해당 works case를 펼침 상태로 설정
      storage.set('worksCurrentCode',{
        currentCode:values.caseCode
      })
    }
  },[isSuccessSearch]);

  return (

    <>
      {!listReducer.message.success && <FullScreenLoading />}
      <Styled.AlertContainer>

        <div className="AlertContainer__sort_box">
          <div className={cx("AlertContainer__sort", "sort_checkbox")}>
            <Checkbox
              value="secondary"
              color="primary"
              checked={values.allCheckBox}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              onChange={handleCheck({ type: HANDLEEVENTTYPE.allSelect })}
            />
          </div>
          <div className={cx("AlertContainer__sort", "sort_btn_box")}>
            <button className="sort_btn" onClick={handleClick({ type: HANDLEEVENTTYPE.deleteMessage})}>DELETE</button>
            <button className="sort_btn" onClick={handleClick({ type: HANDLEEVENTTYPE.readMessage })}>READ</button>
          </div>
          <div className={cx("AlertContainer__sort", "sort_refresh")}>
            <button className="sort_refresh_btn" onClick={handleClick({ type: HANDLEEVENTTYPE.refresh })}><CachedIcon style={{ fontSize: 30 }} /></button>
          </div>


        </div>
        <AlertList
          list={values.list}
          checkedId={values.checkEventId}
          handleCheck={handleCheck}
          handleClick={handleClick}
        />
        <div className="AlertContainer__page_btn">
          <div style={{ textAlign: 'right' }}>
            <ArrowPageContainer
              sagas={(config) => MESSAGE_LIST_SAGAS({ ...searchConfig, ...config })}
              success={listReducer.message.success}
              failure={listReducer.message.failure}
              pending={listReducer.message.pending}
              page={rPagingData.page}
              url={'/alert/list'}
              matchUrl={props.match.params.list}
              pagingData={rPagingData}
              paging={{
                prevPageText: <ArrowBackIosIcon
                  disabled={values.pageData.isEndPrevPage}
                  className={cx("Arrow__btn_svg", { disabled: values.pageData.isEndPrevPage })}
                />,
                nextPageText: <ArrowForwardIosIcon
                  disabled={values.pageData.isEndNextPage}
                  className={cx("Arrow__btn_svg", { disabled: values.pageData.isEndNextPage })}
                />
              }}
            />
          </div>
        </div>

      </Styled.AlertContainer>
      <PlainModal
        isOpen={values.modal.open}
        content={modalCont}
        onClick={closeModal}
        dim={false}
      />
    </>

  );
}

const Styled = {
  AlertContainer: styled.div` 
  padding: 50px;

  .AlertContainer__sort_box {
    position: relative;
    border-bottom: 1px solid #E2E7EA;
  }
  .AlertContainer__sort {
    display: inline-block;
    line-height: 42px;

    &.sort_checkbox{
      margin-right: 18px;
    }
  }

  .sort_btn {
    border: 1px solid #777;
    background-color: #fff;
    ${font(15, '#777')};
    margin-right: 5px;
    cursor: pointer;
    transition: all .2s;
    width: 80px;
    height: 33px;
    line-height: 31px;
  }
  .sort_refresh_btn{
    border: none;
    position: absolute;
    right: 0;
    top: 10px;
    color: ${color.blue};
    background: none;
    cursor: pointer;
    transition: all .2s;
    
    &:hover{
      color: ${color.blue_hover};
      /* animation: 3s rotate infinite linear; */
    }
    &:focus{
      outline: none;
    }
    @keyframes rotate{
      from {transform: rotate(0)}
      to{transform: rotate(-360deg)}
    }
  }

  .AlertContainer__page_btn{
      color: ${color.black_font};
      cursor: pointer;
      margin-top: 20px;    
    }
   .MuiCheckbox-colorPrimary.Mui-checked{
    color: ${color.blue};
   }
  `
}



export default withRouter(AlertContainer);