import React, { useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { color, font, buttonBlue, dotdotdot } from "styles/__utils";
import { useImmer } from "use-immer";
import Button from "@material-ui/core/Button";
import { PlainModal, ModalPartner } from "components/common/modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { PartnersList } from "components/common/listing";
import { PartnersSearch } from "components/common/search";
import { useSelector } from "react-redux";
// import Core from 'containers/base/Core';
import InfiniteScroll from "react-infinite-scroll-component";

import {NoticeBackgroundImg} from 'components/common/notice';

import {
  LISTING_PARTNERS_SEARCH_SAGAS,
  LISTING_MY_PARTNERS_SAGAS,
  // INFO_PARTNERS_MODAL_INFO_SAGAS,
  INFO_INFORMATION_SAGAS
  // LISTING_PARTNERS_INFO_SAGAS,
  // LISTING_PARTNERS_INFO
} from "store/actions";

import {
  icon_partner_search,
  icon_arrow_under
} from "components/base/images";

// import { makeStyles } from '@material-ui/core/styles';
// import { LoadingCircle } from 'components/base/loading'
// import { InfiniteScroll } from 'components/base/scroll';

import { mapper } from "lib/mapper";

const { HANDLEEVENTTYPE, PARTNERSEARCHTYPE: {typeList} } = mapper;

/**
 *
 * @param {*} props
 * {
 *  selectCompany function //select change value function
 *  onSubmit function // inner submit button function
 *  option string ['my'] // my partner list
 *  styleConf object { searchDivtype string ['row'] , radioExist: boolean, buttonExist: boolean, tableHeight: int }
 *  selectOption string ['onlySelect'] // row item 클릭시 select만 선택, 없을시 info popup
 * }
 */

function PartnerListSearchForm(props) {
  const {
    auth: authReducer,
    listing: listingReducer,
    mypage: mypageReducer
  } = useSelector(state => state);
  const infinoteRef = useRef();
  const { myinfo: rMyinfo } = mypageReducer;
  const {
    partners: rPartners,
    myPartners: rMyPartners,
    partnersAdd: rPartnersAdd,
    partnersDelete: rPartnersDelete,
    partnersType: { list: rTypeList }
  } = listingReducer;
  const { list: partnersList } = rPartners;
  const { list: myPartnerList } = rMyPartners;
  let hasMore = false,
    listMax = 100;
  let loadConfig = {};

  if (props.option === "my") {
    if (myPartnerList.length < listMax) {
      // console.log("DEBUG ISEND!!!", rMyPartners.isEnd);
      if (rMyPartners.isEnd) {
        hasMore = false;
      } else {
        hasMore = true;
      }
    }
    // 무한 스크롤시 요청 data form
    loadConfig = {
      userCode: authReducer.signIn.profile.userCode,
      page: rMyPartners.page,
      codeType: rMyPartners.codeType,
      type: rMyPartners.type,
      keyword: rMyPartners.keyword
    };
  } else {
    if (partnersList.length < listMax) {
      // console.log("DEBUG ISEND!!!", partners.isEnd);
      if (rPartners.isEnd) {
        hasMore = false;
      } else {
        hasMore = true;
      }
    }
    // 무한 스크롤시 요청 data form
    loadConfig = {
      userCode: authReducer.signIn.profile.userCode,
      page: rPartners.page,
      codeType: rPartners.codeType,
      type: rPartners.type,
      keyword: rPartners.keyword
    };
  }
  // console.log("DBDFDFD", loadConfig);

  const initState = {
    toggle: {
      sortOption: false,
    },
    searchType: {
      value: 0
    },
    companySelected: {
      value: ""
      // value: props.option === 'my'? myinfo.info.partnerInfo.code : ''
      // value: authReducer.signIn.profile.pCode? authReducer.signIn.profile.pCode : ''
    },
    partnerList: [],
    partnerModal: false,
    clickModal: false,
    partnerModalInfo: null,
    pCode: authReducer.signIn.profile.pCode
      ? authReducer.signIn.profile.pCode
      : "",
    viewPartnerList: props.option === "my" ? true : false
  };
  const [values, setValues] = useImmer(initState);

  const { searchType, companySelected } = values;
  const styleConf = props.styleConf ? props.styleConf : null;

  /**
   * value: string
   */
  const handleChange = useCallback(
    value => e => {
      const targetValue = e.target.value;
      console.log("targeetV", targetValue);
      // 고유번호, 업체명 셀렉
      if (value === HANDLEEVENTTYPE.searchType) {
        setValues(draft => {
          draft.searchType.value = targetValue;
        });
      }
    },
    [setValues]
  );

  // 모달 dim 클릭 관리, info 모달 관리
  /**
   * config {
   *  "type": string,
   *  "value" : string
   * }
   */
  const handleModal = useCallback(config => {
      const {
        type,
        value
      } = config;

      if (type === HANDLEEVENTTYPE.modalGetInfo) {
        setValues(draft => {
          draft.clickModal = true;
        });
        const conf = {
          userCode: value
        };
        INFO_INFORMATION_SAGAS(conf);
      } else if (type === HANDLEEVENTTYPE.dim) {
        setValues(draft => {
          draft.partnerModal = false;
          draft.clickModal = false;
        });
      }
    }, []);

  // 클릭 이벤트 관리
  const handleClick = useCallback(
    config => e => {
      const { type } = config;
      if (type === HANDLEEVENTTYPE.selected) {
        if (e.component === HANDLEEVENTTYPE.PartnersList) {
          setValues(draft => {
            draft.companySelected = e;
          });
        }
      }

      if (type === HANDLEEVENTTYPE.changePartner) {
        props.onSubmit && props.onSubmit(values);
      }
    },
    [values.companySelected]
  );
  // const loadConfig = {
  //   userCode: authReducer.signIn.profile.userCode,
  //   page: partners.page
  // }

  // Partners List Search Submit
  const onSubmit = useCallback(
    config => {
      let searchConfig = {
        userCode: authReducer.signIn.profile.userCode,
        page: 1,
        type: values.searchType.value,
        codeType: config.selectedType,
        keyword: config.keyword,
        first: true
      };
      infinoteRef.current.el.scrollTo(0, 0);
      console.log("DDDD", searchConfig);
      if (props.option === "my") {
        LISTING_MY_PARTNERS_SAGAS(searchConfig);
      }else {
        LISTING_PARTNERS_SEARCH_SAGAS(searchConfig);
      }
    },
    [props.option, values.searchType]
  );

  const handleToggle = config => {
    const {type, isShow} = config;
    if(isShow !== undefined){
      setValues(draft => {
        draft.toggle.sortOption = isShow;
      })
    }else{
      if(type === 'showToggle'){
        setValues(draft => {
          draft.toggle.sortOption = !values.toggle.sortOption;
        });
      }

    }
  }

  // my info 정보 가져왔을때
  useEffect(() => {
    if (rMyinfo.success) {
      //모달이 필요할때
      if (values.clickModal) {
        setValues(draft => {
          draft.partnerModal = true;
          draft.partnerModalInfo = rMyinfo.partnerInfo;
        });
      } else {
        //정보만 가져올때
        setValues(draft => {
          draft.pCode = rMyinfo.userInfo.partnerInfo
            ? rMyinfo.userInfo.partnerInfo.code
            : null;
        });
      }
    }
  }, [rMyinfo.success]);

  //파트너 추가했을때
  useEffect(() => {
    if (rPartnersAdd.success) {
      INFO_INFORMATION_SAGAS({
        userCode: authReducer.signIn.profile.userCode,
        option: "loginUser"
      });
    }
    if (rPartnersDelete.success) {
      if (props.option === "my") {
        let initConfig = {
          userCode: authReducer.signIn.profile.userCode,
          page: 1,
          codeType: 1,
          type: 0,
          keyword: "",
          first: true
        };
        LISTING_MY_PARTNERS_SAGAS(initConfig);
      }
    }
  }, [rPartnersAdd.success, rPartnersDelete.success]);

  //페이지 렌더링 됐을때
  useEffect(() => {
    let initConfig = {
      // userCode: "20Jan31-0000",
      userCode: authReducer.signIn.profile.userCode,
      page: 1,
      codeType: 1,
      type: 0,
      keyword: "",
      first: true
    };
    INFO_INFORMATION_SAGAS({
      userCode: authReducer.signIn.profile.userCode,
      option: "loginUser"
    });
    // 내 파트너 정보를 가져올떄
    if (props.option === "my") {
      LISTING_MY_PARTNERS_SAGAS(initConfig);
    } else {
      //파트너 리스트를 가져올때
      // LISTING_PARTNERS_SEARCH_SAGAS(initConfig);
    }
    setValues(draft => {
      draft.partnerModal = false;
    });

    return() => {
      LISTING_PARTNERS_SEARCH_SAGAS.init();
    }
  }, []);

  //내 파트너 리스트 가져왔을때
  useEffect(() => {
    if (props.option === "my" && rMyPartners.success) {
      //파트너 리스트가 있을때 내 파트너의 radio 체크 설정
      if (myPartnerList.length > 0) {
        // console.log("DEBUG myinfo.userInfo baseItem", rMyinfo.userInfo);
        let baseItem = myPartnerList.filter(i => {
          return (
            i.info.userCode === (rMyinfo.userInfo.partnerInfo && rMyinfo.userInfo.partnerInfo.code)
          );
        })[0];
        // console.log("DEBUG SEARCHFORM baseItem", baseItem);
        setValues(draft => {
          draft.companySelected = baseItem && baseItem.info;
          draft.companySelected = {
            ...draft.companySelected,
            value: draft.companySelected && draft.companySelected.userCode,
          };
        });
      }
      setValues(draft => {
        draft.partnerList = myPartnerList;
        draft.partnerModal = false;
      });

      props.routeHistory && props.routeHistory();
    }
  }, [rMyPartners.success]);

  useEffect(() => {
    if (!(props.option === "my") && rPartners.success) {
      setValues(draft => {
        draft.partnerList = partnersList;
        draft.viewPartnerList = true;
      });
    }
  }, [rPartners.success]);

  // radio 체크 됐을때
  useEffect(() => {
    if (values.companySelected) {
      props.selectCompany && props.selectCompany(values.companySelected);
    }
  }, [values.companySelected]);

  let endMessage = "";
  if (props.option === "my") {
    endMessage = myPartnerList.length
      ? myPartnerList.length <= listMax
        ? ""
        : `리스트는 ${listMax} 까지만 보여집니다.`
      : "리스트가 없습니다.";
  } else {
    if (partnersList.length) {
      if (partnersList.length <= listMax) {
        endMessage = "";
      } else {
        endMessage = `리스트는 ${listMax} 까지만 보여집니다.`;
      }
    } else {
      endMessage = "리스트가 없습니다.";
    }
  }

  let sortType = typeList.base.text;
  Object.keys(typeList).forEach(i => {
    if(values.searchType.value === typeList[i].id){
      sortType = typeList[i].text;
    }
  });

  let typeItem = Object.keys(typeList).map((i, idx) => {
    return (
      <li
      key={idx}
      value={typeList[i].id}
      onClick={handleChange(HANDLEEVENTTYPE.searchType)}
      >
        {typeList[i].text}
      </li>
    );
  });

  return (
    <Styled.PartnerListSearchForm isModal={props.isModal}>
      <div className="row_box">
        {
          props.isModal ? null : <div
            className={`partenrs__row ${
              props.styleConf ? props.styleConf.searchDivtype : ""
            } type_box`}
          >
            <button
              className="Partners__input_sort_btn"
              onClick={e => handleToggle({type: "showToggle", e})}
              onBlur={e => handleToggle({isShow: false})}
            >
              {sortType}
              <ul 
                className={`Partners__input_sort_option 
                ${values.toggle.sortOption? 'show': 'hidden'}`}
              >
                {typeItem}
              </ul>
            </button>
          </div>
        }
        <div
          className={`partenrs__row ${
            props.styleConf ? props.styleConf.searchDivtype : ""
          } search_box`}
        >
          <PartnersSearch 
            onSubmit={onSubmit} 
            typeList={rTypeList} 
            isModal={props.isModal} 
          />
        </div>
      </div>

      <div
        className={`partenrs__row partnesr_list ${
          values.viewPartnerList ? "show" : "hidden"
        }`}
      >
        <InfiniteScroll
          {...props}
          ref={infinoteRef}
          next={() =>
            props.option === "my"
              ? LISTING_MY_PARTNERS_SAGAS(loadConfig)
              : LISTING_PARTNERS_SEARCH_SAGAS(loadConfig)
          }
          height={
            styleConf && styleConf.tableHeihgt ? styleConf.tableHeihgt : 350
          }
          dataLength={
            props.option === "my" ? myPartnerList.length : partnersList.length
          }
          hasMore={hasMore}
          loader={
            <div className="align__center">
              <p className="cassload__loading">Loading..</p>
            </div>
          }
          endMessage={
            <div className="align__center">
              <p className="cassload__info">{endMessage}</p>
            </div>
          }
        >
          <PartnersList
            list={values.partnerList}
            info={companySelected}
            option={props.option}
            selectOption={props.selectOption}
            pCode={values.pCode}
            onClick={result =>
              handleClick({ type: HANDLEEVENTTYPE.selected })(result)
            }
            handleModal={handleModal}
            isModal={props.isModal}
          />
        </InfiniteScroll>

        <PlainModal
          isOpen={!!values.partnerModal}
          onClick={() => handleModal({ type: HANDLEEVENTTYPE.dim })}
          content={<ModalPartner modalInfo={values.partnerModalInfo} handleClick={props.handleClick} option={props.option} />}
          width={680}
          dim={true}
        />
      </div>
      <NoticeBackgroundImg 
        ishidden={values.viewPartnerList}
        contHeight={'700px'}
        img={{src: icon_partner_search, width: '100px', height: '100px'}}
        titleTxt={{size: '22px', color: '#555', txt: '파트너를 검색하여 요청할 수 있습니다'}}
        subTxt={{size: '18px', color: '#777', txt: '고유번호 혹은 업체명 등으로 파트너를 검색하세요.'}}
      />
      
      {(styleConf===null || styleConf && styleConf.buttonExist) && (
        <div className="partenrs__row">
          <div className="list__btn_box">
            <Button
              onClick={props.onCancle}
              className="partnerChange_cancel"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleClick({ type: HANDLEEVENTTYPE.changePartner })}
              variant="contained"
              className="partnerss__btn"
              component="span"
            >
              CHANGE
            </Button>
          </div>
        </div>
      )}
    </Styled.PartnerListSearchForm>
  );
}

const Styled = {
  PartnerListSearchForm: styled.div`
  .partnesr_list{
    &.show{
        display: block;
      }
      &.hidden{
        display: none;
      }
  }

  .row_box{
    width: 100%;
    position: relative;
    margin-bottom: 10px;
    display: flex;
    /* flex-flow: column nowrap; */
    height: 50px;
    justify-content: flex-end;
    align-items: center;

    .partenrs__row{
      display: flex;
      /* flex-flow: column nowrap; */

      &.type_box {
        flex-basis: 7%;
        max-width: 7%;
        height: 100%;

        .Partners__input_sort_btn {
          position: relative;
          width: 100%;
          height: 100%;
          border: none;
          background-color: #fff;
          cursor: pointer;
          ${font(16, "#777")};
          padding: 0 15px;
          padding-right: 32px;
          vertical-align: bottom;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          border: 1px solid #CACFD2;

          &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            width: 8px;
            height: 13px;
            background: url(${icon_arrow_under}) no-repeat center;
            background-size: contain;
          }
        }

        .Partners__input_sort_option{
          position: absolute;
          left: 0;
          bottom: -1px;
          transform: translateY(100%);
          background-color: #fff;
          width: 100%;
          ${font(14, "#555")};
          margin-top: 1px;
          z-index: 999;
          border: 1px solid #E2E7EA;
          padding: 15px 20px;
          margin-bottom: 0;
          transition: all 0.3s ease-out;

          &.show {
            opacity: 1;
            visibility: visible;
          }

          &.hidden {
            opacity: 0;
            visibility: hidden;
          }
        }
      }

      &.search_box{
        flex-basis: ${props => props.isModal ? '74%' : '40%'};
        max-width: ${props => props.isModal ? '74%' : '40%'};
      }
    }
  }

    & .rowMode{
      display: inline-block;
      vertical-align: middle;
    }

    .partenrs__column{
      display: flex;
      margin-bottom: 10px;
    }
    .list__control .MuiFormGroup-root{
      flex-wrap:nowrap;
    }

    .MuiSelect-outlined.MuiSelect-outlined{
      padding:10px;
      font-size: 14px;
    }
    .partnerss__btn{
      ${buttonBlue};
      box-shadow:none;
      margin-left: 5px;
      &:hover{
        box-shadow:none;
      }
    }
    .partnerChange_cancel {
      ${buttonBlue};
      color: #00a6e2;
      background-color: #fff;
      border: 1px solid #00a6e2;
      &:hover{
        background-color: #fff;
      }
    }
    .list__box_tx{
      &.tx{
        padding:0 5px;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        ${font(14, color.black_font)};
        ${dotdotdot};
        width:100%;
      }
      &.bold{
        font-weight:600;
      }
    }
    .list__box_item{
      position:relative;
      height:50px;
      border-right:1px solid ${color.gray_border6};
      text-align:center;
      &:last-child{
        border-right:0;
      }
      &.th{
        background:${color.gray_bg1};
      }
      &.td{

      }
    }
    .list__btn_box{
      /* border-top:1px solid ${color.gray_border6}; */
      text-align:center;
      padding-top:15px;
    }
    .cassload__info,.cassload__loading{
      ${font(14)};
      text-align:center;
      margin-top:10px;
    }
    .columnWide{
      color: ${color.blue};
    }
    .MuiRadio-colorPrimary.Mui-checked{
      color: ${color.blue};
    }
  `
};

export default React.memo(PartnerListSearchForm);

{
  /* {isSearchSaga ?
  <InfiniteScroll
  type={1}
    maxDataLength={100}
    dataLength={partnersList.length}
    next={()=>LISTING_PARTNERS_SEARCH_SAGAS(loadConfig)}
    unMount={LISTING_PARTNERS_INFO.init}
    height={425}
  >
    <PartnersList
      list={partnersList}
      info={companySelected}
      onClick={(result) => handleClick({ type: "selected" })(result)}
    />
    <br />
  </InfiniteScroll>
  :
  <InfiniteScroll
    type={2}
    maxDataLength={100}
    dataLength={partnersList.length}
    next={()=> LISTING_PARTNERS_INFO_SAGAS(loadConfig)}
    unMount={LISTING_PARTNERS_INFO.init}
    height={425}
  >
    <PartnersList
      list={partnersList}
      info={companySelected}
      onClick={(result) => handleClick({ type: "selected" })(result)}
    />
    <br />
  </InfiniteScroll>
} */
}
