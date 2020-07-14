import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { compareProp } from 'lib/library';
import { font, color, dotdotdot } from 'styles/__utils';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { CustomTooltip, S_CustomCasePartner } from 'components/common/tooltip';
import { CustomDatePicker } from 'components/common/input';
import { regName, log } from 'lib/library';
import { DateConverter } from 'components/base/helpers/convert';
import { useImmer } from 'use-immer';
import { mapper } from 'lib/mapper';
import { DropDownInput } from 'components/common/input';
import { HtmlConverter } from 'components/base/helpers/convert';
import { Visible } from 'components/base/helpers/visible';
import { CaseMemo } from 'components/common/case';

import {
  icon_works_detail_copy,
  icon_works_detail_delete,
  icon_works_detail_hidden,
  icon_edit,
  icon_partner_change,
} from 'components/base/images';


const CaseInfoTopCardState = {
  patient: "",
  receiverName: "",
  senderName: "",
  sender: {
    isOpen: true,
    hidden: false,
    isEdit: false,
    editor: {
      content: ""
    }
  },
  receiver: {
    isOpen: true,
    hidden: false,
    isEdit: false,
    editor: {
      content: ""
    }
  },
}

const CaseCardLeft = React.memo(function CaseCardLeft(props) {
  const {
    caseMode = "",
    onChange = () => { },
    onSubmit = () => { },
    onClick = () => { },
    info = {},
    type = "",
    profile = {}
  } = props;

  const [values, setValues] = useImmer(CaseInfoTopCardState)
  const {
    caseId, 
    patient, 
    dueDate, 
    senderName,
    partner, 
    senderMemo, 
    receiverMemo
  } = info;
  const partnerManagerName = partner.manager;
  const isCreateType = type === 'create';
  const isModifyMode = type === 'modify';
  const isControlCont = isCreateType || isModifyMode;
  const isSenderCase = profile.userCode === info.senderCode;
  const isReceiverCase = info.userCode === info.receiverCode;
  const isSenderModifyMode = ((isCreateType || isModifyMode) && isSenderCase);
  const isReceiverModifyMode = ((isCreateType || isModifyMode) && isReceiverCase);
  const hasReceiverManager = partnerManagerName ? `(${partnerManagerName})` : "";
  const partnerTooltipText = `My Page의 Partners에서 특정 기공소를 등록할 수 있습니다. 
  등록된 기공소가 기본으로 선택되며, 추가 등록을 통해 여러 기공소와 협력할 수 있습니다.`;
  const receiverEditorContent = values.receiver.editor.content;
  const senderEditorContent = values.sender.editor.content;
  const infoSenderMemo = info.senderMemo || "";
  const infoReceiverMemo = info.receiverMemo || "";

  // NOTE: 클릭 이벤트
  /**
   * 
   * @param {string} name 
   */
  const handleClick = name => e => {
    const isNamePartners = name === 'partners';
    if (isNamePartners) onClick(name)();
  }
  // NOTE: 인풋 관련 체인지 이벤트
  /**
   * 
   * @param {string} name 
   * @param {object} e 
   */
  const handleChange = (name, e) => {
    const isNamePatient = name === 'patient';
    const isNameSenderName = name === 'senderName';
    const targetValue = e.target.value;
    const isValuelenCond = targetValue.length >= 100;
    
    if (isNamePatient) {
      if (isValuelenCond) {
        log('이름은 100자리까지만 가능합니다.');
        return;
      }
      if (!regName(targetValue)) {
        log('정규식 실패');
        return;
      }
      setValues(draft => {
        draft.patient = targetValue;
      });
    }
    if (isNameSenderName) {
      setValues(draft => {
        draft.senderName = targetValue;
      });
    }
  };

  const handleChangeMemo = type => config => {
    setValues(draft => {
      draft[type].editor.content = config.data;
    })
  };

  // NOTE: 날짜 관련 변경 이벤트
  /**
   * 
   * @param {string} date 
   */
  const handleDateChange = date => {
    const moDate = date ? moment(date).unix() : moment().unix();
    onChange({ type: 'dueDate', value: moDate });
  };

  // NOTE: 인풋 관련 블러 이벤트
  /**
   * 
   * @param {string} name 
   * @param {object} e 
   */
  const handleBlur = (name, e) => {
    const isNameResponsibility = name === 'responsibility'
    const value = isNameResponsibility ? e : values[name];
    onChange({ type: name, value: value });
  }

  // NOTE: init data
  useEffect(() => {
    setValues(draft => {
      draft.patient = patient;
      draft.senderName = senderName;
    })
  }, [patient, senderName]);

  return (
    <Styled.CaseCardLeft>
      <div className="case_info_btn_gnb">
        <button className="case_control_btn copy">
          copy
        </button>
        <button className="case_control_btn hidden">
          hidden
        </button>
        <button className="case_control_btn delete">
          delete
        </button>
      </div>
      <Grid container className="case_info__row">
        <Grid item xs={3}>
          <span className="CreateCase__title">Case ID </span>
        </Grid>
        <Grid item xs={9}>
          <span className="CreateCase_load">{caseId}</span>
        </Grid>
      </Grid>
      <Grid container className="case_info__row">
        <Grid item xs={3}>
          <span className="CreateCase__title">Patient</span>
        </Grid>
        <Grid item xs={9}>
          {isControlCont
            ? <OutlinedInput
              value={values.patient}
              onChange={(e) => handleChange('patient', e)}
              onBlur={(e) => handleBlur('patient', e)}
              labelWidth={0}
              className="CreateCase_input patient"
            />
            : <span className="CreateCase_load patient">{patient}</span>}
        </Grid>
      </Grid>
      <Grid container className="case_info__row">
        <Grid item xs={3}>
          <span className="CreateCase__title partner">{mapper.receiver}</span>
          <CustomTooltip
            type="help"
            title={partnerTooltipText}
            placement="right-start"
            interactive={false}
            baseStyle
          />
        </Grid>
        <Grid item xs={9}>
          <Grid container>
            <Grid item xs={10} className="case_partner_info">
              <CustomTooltip
                title={<S_CustomCasePartner partnerInfo={partner} />}
                block={true}
                placement="bottom-start"
                baseStyle
                _style={{ top: `25px`, left: `-8px` }}
              >
                <span className="CreateCase_load tx">{partner.title && `${partner.title} ${hasReceiverManager}`}</span>
              </CustomTooltip>
            </Grid>
            {isControlCont &&
              <Grid item xs={2} className="partner_change_btn">
                <button
                  onClick={handleClick('partners')}
                  className="CreateCase__button"
                  >Change</button>
              </Grid>}
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="case_info__row">
        <Grid item xs={3}>
          <span className="CreateCase__title date">Due Date</span>
        </Grid>
        <Grid item xs={9}>
          {isControlCont
            ? <CustomDatePicker
              value={moment.unix(dueDate)}
              className="CreateCase_input date"
              onChange={handleDateChange}
              style={{width: '100%', height: '40px'}}
            />
            : <span className="CreateCase_load date">
              <DateConverter
                timestamp={dueDate}
                format="YYYY-MM-DD"
              />
            </span>}
        </Grid>
      </Grid>
      <Grid container className="case_info__row">
        <Grid item xs={3}>
          <span className="CreateCase__title manager">Manager</span>
        </Grid>
        <Grid item xs={9}>
          {isControlCont
            ? <DropDownInput
              defaultValue={info.responsibility}
              value={values.senderName}
              keywordList={info.responsibilityList}
              onBlur={(e) => handleBlur('responsibility', e)}
              boxStyle={{ marginTop: 8 }}
              inputStyle={{
                padding: `8px 15px`,
                width: `100%`,
                height: `40px`,
                fontSize: 14,
              }}
            />
            : <span className="CreateCase_load patient">{info.responsibility}</span>}
        </Grid>
      </Grid>
      <Grid container className="case_info__row">
        <div className="case_info_memo">
          <div className="case_infoMemo__title">
            <span className="title">{`${mapper.sender}'s Memo`}</span>
          </div>
          <div className="case_infoMemo__con">
            <Visible
              show={[isControlCont, isSenderModifyMode]}
              failure={<HtmlConverter>{infoSenderMemo || "-"}</HtmlConverter>}
              success={
                <CaseMemo
                  content={senderEditorContent}
                  onChange={handleChangeMemo('sender')}
                  onBlur={handleChangeMemo('sender')}
                />}
            />
          </div>
        </div>
      </Grid>
      <Grid container className="case_info__row">
        <div className="case_info_memo">
          <div className="case_infoMemo__title">
            <span className="title">{`${mapper.receiver}'s Memo`}</span>
          </div>
          <div className="case_infoMemo__con">
            <Visible
              show={[isControlCont, isReceiverModifyMode]}
              failure={<HtmlConverter>{infoReceiverMemo || "-"}</HtmlConverter>}
              success={
                <CaseMemo
                  content={receiverEditorContent}
                  onChange={handleChangeMemo('receiver')}
                  onBlur={handleChangeMemo('receiver')}
                />}
            />
          </div>
        </div>
      </Grid>
    </Styled.CaseCardLeft>
  );
}, (nextProp, prevProp) => {
  return compareProp(nextProp, prevProp, ['info', 'type', 'profile'])
});

const Styled = {
  CaseCardLeft: styled.div`
    .case_info_btn_gnb {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 25px;
      button {
        text-indent: -9999px;
        width: 30px;
        height: 30px;
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
      }
      
      button + button {
        margin-left: 10px;
      }

    }
    
    .case_info__row {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .case_info__row + .case_info__row {
      margin-top: 20px;
    }

    .CreateCase__title {
      font-size: 16px;
      font-weight: 600;
      color: #242F35;

      &.partner {
        margin-right: 5px;
      }
    }

    .partner_change_btn {
      padding-left: 5px;
      text-align: right;

      button {
        width: 40px;
        height: 40px;
        text-indent: -9999px;
        border: none;
        overflow: hidden;
        cursor: pointer;
        background: url(${icon_partner_change}) #98B8CB no-repeat center;
      }
    }

    .case_partner_info {
      display: flex;
      justify-content: center;

    }

    .CreateCase_input {
      width: 100%;
    }

    .CreateCase_load {
      display: inline-block;
      width: 100%;
      height: 40px;
      line-height: 40px;
    }

    .case_info_memo {
      flex: 1;
      max-width: 100%;

      .case_infoMemo__title {
        display: flex;
        justify-content: space-between; 
        font-size: 16px;
        font-weight: 600;
        color: #242F35;
        .memo_edit_btn {
          border: none;
          background: url(${icon_edit}) no-repeat center #00A6E2;
          width: 20px;
          height: 20px;
          cursor: pointer;
          text-indent: -9999px;
        }
      }
      
      .case_infoMemo__con {
        margin-top: 8px;
        
        .case_infoMemo_cont {
          background-color: #FAFAFA;
          border: 1px solid #CACFD2;
          height: 130px;
          overflow-y: scroll;
          padding: 15px;
        }
      }
    }

  `,
}

export default CaseCardLeft;