import React from 'react';
import {useImmer} from 'use-immer';
import styled from 'styled-components';
import {font,color} from 'styles/__utils';
import moment from 'moment';
import {icon_unlogged_person} from 'components/base/images';
import { ModalConfirmContent, PlainModal } from 'components/common/modal';

import {mapper} from 'lib/mapper';
const {HANDLEEVENTTYPE} = mapper;

const initState = {
  modal: {
    deleted : false,
    current : null,
  }
}

function ModalPartner(props) {
  const {
    modalInfo,
    handleClick,
    option,
  } = props;
  let {
    profile,
    country_id,
    myCode,
    company,
    manager,
    email,
    phone,
    address,
    country,
    state,
    type,
    licenseData
  } = modalInfo;

  const [valuses, setValues] = useImmer(initState);

  const defaultProfilePath = icon_unlogged_person;
  profile = profile ? profile : defaultProfilePath;

  const label = {
    email: '메일 주소',
    myCode : '고유번호',
    company : '업체명',
    manager: '대표자',
    type: '타입',
    local: '지역',
    licence: '기공소 라이센스',
    phone: '연락처',
    address:'주소',
  }
  
  //데이터 파싱
  const typeList = {
    clinic: '클리닉',
    lab: '기공소',
    milling: '밀링센터',
    none: '없음'
  }

  let koreaAuthState = '';
  if(country_id=== 116 && licenseData){
      if(licenseData.state === 0){
          koreaAuthState = '(신청)';
      }else if(licenseData.state === 1){
          koreaAuthState = '(인증완료)';
      }else{
          koreaAuthState = '(거부)';
      }
  }

  const data = {
    myCode: myCode,
    company: company,
    manager: manager,
    email: email,
    phone: phone,
    address: address,
    licence: licenseData? `${licenseData.licenseCode} ${koreaAuthState} (${moment(licenseData.licenseDate).format("YYYY-MM-DD")})` : "",
    local: `${country} / ${state}`,
    type: `${
      Object.keys(type).map(i => {
        return type[i] ? typeList[i] : '';
      }).join(' ').length ? 
      Object.keys(type).map(i => {
        return type[i] ? typeList[i] : '';
      }).join(' ')
      :
      typeList["none"]
    }`,
  }

  const tagCont = Object.keys(label).map((i, index) => {
    if(i === 'licence'){
      if(type.lab){
        return(
          <div className="row" key={index}>
            <div className="row_label">
              {label[i]}
            </div>
            <div className="row_cont">
              {data[i]}
            </div>
          </div>
        );
      }
    }else{
      return(
        <div className="row" key={index}>
          <div className="row_label">
            {label[i]}
          </div>
          <div className="row_cont">
            {data[i]}
          </div>
        </div>
      );
    }
    
  });

  const openModal = () => {
    setValues(draft => {
      draft.modal.deleted = true;
      draft.modal.current = 'deleted';
    });
  }

  const onDeleteControl = type => {
    setValues(draft => {
      draft.modal.deleted = false;
      draft.modal.current = null;
    });

    if(type==='ok'){
      handleClick({
        type: HANDLEEVENTTYPE.deletePartner,
        partnerCode: myCode
      })();
    }
    
  }

  const currentModal = valuses.modal.current;
  const isOpenModal = !!valuses.modal[currentModal];

  const modalObj = {
    'deleted': <ModalConfirmContent
      title="파트너를 삭제하시겠습니까?"
      subtitle="파트너 삭제 시 작업을 의뢰하거나 받을 수 없습니다. 어쩌고저쩌고"
      okClick={() => onDeleteControl('ok')}
      cancelClick={() => onDeleteControl()}
    />
  }
  const modalContent = modalObj[currentModal];

  return (
    <Styled.ModalPartner>
      <div className="partner_info_wrap">
        <div className="profile">
          <img src={profile} />
        </div>
        <div className="cont">
          {
            tagCont
          }
        </div>
      </div>
      {
        option==='my'?
        (
          <div className="delete__btn">
            <button onClick={openModal}>
              파트너 삭제하기
            </button>
          </div>
        )
        :
        null
      }
      <PlainModal
        isOpen={isOpenModal}
        content={modalContent}
        dim={false}
      />
    </Styled.ModalPartner>
  );
}

const Styled = {
  ModalPartner: styled.div`
    position: relative;
    padding: 40px 30px 20px;

    .partner_info_wrap {
      position: relative;
      min-height: 600px;
      border: 1px solid ${color.gray_border6};
      padding: 50px 20px 32px 40px;

      .profile{
        text-align: center;

        img{
          display: inline-block;
          width: 100px;
          height: 100px;
          border: 1px solid #777;
          border-radius: 10px;
        }
      }
      .cont{
        margin-top: 50px;
        min-height: 265px;
        .row{
          position: relative;
          ${font(16, color.black_font)};
          .row_label{
            position: absolute;
            left: 0;
            top: 0;
            font-weight: 500;
            color: ${color.black_font};
          }
          .row_cont{
            display: inline-block;
            padding-left: 140px;
            color: ${color.gray_font};
          }
        }
        .row + .row{
          margin-top: 25px;
        }
      }
    }
    
    .delete__btn {
      margin-top: 10px;
      font-size: 0;

      button {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        color: #fff;
        background-color: #98B8CB;
        font-size: 16px;
        font-weight: 600;
        border: none;
        cursor: pointer;
      }
    }
  `,
}

export default ModalPartner;