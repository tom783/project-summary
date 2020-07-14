import React, { useEffect } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import Panel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Link } from 'react-router-dom';
import { mapper } from 'lib/mapper';
import { Visible } from 'components/base/helpers/visible';
import { useImmer } from 'use-immer';
import { CaseMemo } from 'components/common/case';
import { TeethModule } from 'components/common/module';
import { HtmlConverter } from 'components/base/helpers/convert';
import { CustomTooltip } from 'components/common/tooltip';


import IndicationComponent from 'components/common/teethModel/IndicationComponent';


import {
  compareProp,
  log
} from 'lib/library';
import {
  color,
  font
} from 'styles/__utils';

const CasePanelState = {
  indication: {
    isOpen: true,
    hidden: false,
    isEdit: false,
  },
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
  heading: {
    position: 'relative'
  }
}

const CasePanel = React.memo(function CasePanel(props) {
  const {
    caseMode = "",
    info = {},
    onSubmit = () => { }
  } = props;

  const [values, setValues] = useImmer(CasePanelState);
  const isCreateType = caseMode === 'create';
  const isModifyMode = caseMode === 'modify';
  const isLoadType = caseMode === 'load';
  const isSenderCase = info.userCode === info.senderCode;
  const isReceiverCase = info.userCode === info.receiverCode;
  const isIndicationEditMode = values.indication.isEdit;
  const isActiveModifyBtn = isLoadType && isSenderCase;
  const isActiveReceiverMemoEditBtn = isLoadType && isReceiverCase;
  const isActiveIndicationSetBtn = isModifyMode && isSenderCase && isIndicationEditMode;
  const infoSenderMemo = info.senderMemo || "";
  const infoReceiverMemo = info.receiverMemo || "";
  const receiverEditorContent = values.receiver.editor.content;
  const senderEditorContent = values.sender.editor.content;

  // NOTE: for panel map array
  const IndicationPanel = IndividualPanel;
  const SenderMemo = IndividualPanel;
  const ReceiverMemo = IndividualPanel;

  const panelSubmitListConf = [{
    isShow: isActiveModifyBtn,
    name: "modify",
    title: "Modify"
  },
  {
    isShow: isCreateType,
    name: "create",
    title: "Create"
  },
  {
    isShow: isModifyMode,
    name: "update",
    title: "Change"
  }];

  // NOTE: button click event
  /**
   * 
   * @param {object} config 
   */
  const handleClick = config => {
    const { type = "", value = "", name = "" } = config;
    const isTypeSubmit = type === 'submit';
    const isTypeEdit = type === 'edit';
    const isNameReceiver = name === 'receiver';
    const isNameIndication = name === 'indication';
    const isValueEdit = value === 'edit';

    if (isTypeSubmit) onSubmit({ name: name, panel: values })();
    if (isTypeEdit) {
      if (isNameIndication) {
        // NOTE: 인디케이션 개발 들어갈때 손봐야함
        log('indication edit button');
      }
      if (isNameReceiver && isValueEdit) {
        log(config, 'Case panel memo');
        setValues(draft => {
          draft.receiver.isEdit = true;
        });
        onSubmit({ name: 'modify', panel: values })();
      }
    }
  }

  // NOTE: memo change event and blur event
  /**
   * 
   * @param {string} type 
   * @param {object} config
   */
  const handleChange = type => config => {
    setValues(draft => {
      draft[type].editor.content = config.data;
    })
  };

  // NOTE: default state setting
  useEffect(() => {
    if (isCreateType) {
      setValues(draft => {
        draft.indication.isEdit = true;
        draft.sender.isEdit = true;
        draft.receiver.isEdit = true;
        draft.receiver.hidden = true;
      })
    } else if (isLoadType) {
      setValues(draft => {
        draft.receiver.hidden = false;
        draft.receiver.isEdit = false;
        draft.sender.isEdit = false;
        draft.indication.isEdit = false;
        draft.sender.editor.content = infoSenderMemo;
        draft.receiver.editor.content = infoReceiverMemo;
      })
    } else if (isModifyMode) {
      setValues(draft => {
        draft.sender.editor.content = infoSenderMemo;
        draft.receiver.editor.content = infoReceiverMemo;
      })
    }
  }, [setValues, isCreateType, isLoadType, infoSenderMemo, infoReceiverMemo, isModifyMode]);


  return (
    <Styled.CasePanel >
      <IndicationPanel
        panelState={values}
        caseMode={caseMode}
        item={{
          type: "indication",
          summary:
            <MemoTitle
              title={"Indication"}
              showSetBtn={isActiveIndicationSetBtn}
              showEditBtn={false}
              type={'indication'}
              onClickEditBtn={() => handleClick({ type: 'edit', name: 'indication' })}
            />,
          details: <>
          <Link to="/teeth">Dev</Link>
          <IndicationComponent
            onlyView={true}
          />
          </>
        }}
      />
      <SenderMemo
        panelState={values}
        caseMode={caseMode}
        item={{
          type: "sender",
          summary:
            <MemoTitle
              title={`${mapper.sender}'s  Memo`}
              showEditBtn={false}
              type={{ type: 'edit', name: 'sender' }}
            />,
          details: <Visible
            show={[isModifyMode, isSenderCase]}
            orShow={isCreateType}
            failure={<HtmlConverter>{infoSenderMemo || '-'}</HtmlConverter>}
            success={
              <CaseMemo
                content={senderEditorContent}
                onChange={handleChange('sender')}
                onBlur={handleChange('sender')}
              />
            } />,
        }}
      />
      <ReceiverMemo
        panelState={values}
        caseMode={caseMode}
        item={{
          type: "receiver",
          summary:
            <MemoTitle
              stage={info.stage}
              title={`${mapper.receiver}'s  Memo`}
              showEditBtn={isActiveReceiverMemoEditBtn}
              onClickEditBtn={() => handleClick({ type: "edit", name: "receiver", value: 'edit' })}
              type={{ type: 'edit', name: 'receiver' }}
            />,
          details: <Visible
            show={[isModifyMode, isReceiverCase]}
            failure={<HtmlConverter>{infoReceiverMemo || "-"}</HtmlConverter>}
            success={
              <CaseMemo
                content={receiverEditorContent}
                onChange={handleChange('receiver')}
                onBlur={handleChange('receiver')}
              />}
          />
        }}
      />
      <ButtonBox btnList={panelSubmitListConf} handleClick={handleClick} stage={info.stage} />
    </Styled.CasePanel>
  );
}, (nextProp, prevProp) => {
  return compareProp(nextProp, prevProp, ["info", "type"]);
});

/**
 * NOTE: Individual Panel component
 * @param {*} props 
 */
const IndividualPanel = React.memo(function IndividualPanel(props) {
  const { item = {}, caseMode = "", panelState = {} } = props;
  const sectionArr = ['sender', 'indication'];
  const panelItemType = panelState[item.type];
  const isItemExtended = panelItemType.isOpen;
  const hasItemHiddenValue = panelItemType.hidden;
  const makePanelControlsId = `panel-${caseMode}-a-content`;
  const makePanelId = `panel-${caseMode}-a-header`;
  const hasSectionItemType = sectionArr.indexOf(item.type) !== -1;

  return (
    <div >
      {hasSectionItemType && <hr className="boundery__line" />}
      <Panel
        className={cx('panel', { hidden: hasItemHiddenValue })}
        expanded={isItemExtended}
      >
        <ExpansionPanelSummary aria-controls={makePanelControlsId} id={makePanelId}>
          {item.summary}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails >
          {item.details}
        </ExpansionPanelDetails>
      </Panel>
    </div>
  )
})

const MemoTitle = React.memo(function MemoTitle(props) {
  const {
    title = "",
    showEditBtn = false,
    onClickEditBtn = () => { },
    type = "",
    showSetBtn = false,
    stage = 0
  } = props;

  const isCompleteStage = stage === mapper.casePage.memo.flag.complete;
  const isTypeIndication = type === "indication";
  const isShowMemoSetBtn = showSetBtn && !isCompleteStage;
  const isShowCreateBtn = showEditBtn && !isCompleteStage;
  return (
    <div >
      <span className="title__text">{title}</span>
      {isShowCreateBtn &&
        <span onClick={onClickEditBtn} className="edit__icon right">
          <CreateIcon fontSize="small" />
        </span>
      }
      {isTypeIndication &&
        <CustomTooltip
          type="help"
          title={`환자 치아 정보를 입력할 수 있습니다.
          세팅이 완료된 결과값을 미리볼 수 있으며 인디케이션 설정을 통해 보다 정확한 정보를 전달할 수 있습니다.`}
          placement="right-start"
          interactive={false}
          baseStyle
        />
      }
      {isShowMemoSetBtn &&
        <span className="edit__icon right font" onClick={onClickEditBtn}>
          <Visible
            show={showSetBtn}
            success={
              <Button
                variant="contained"
                className="CreateCase__button CreateCase__button-blue float-right"
                component="span">Set
            </Button>}
          />
        </span>
      }
    </div>
  )
}
);


const ButtonBox = React.memo(function ButtonBox(props) {
  const { btnList = [], handleClick = () => { }, stage } = props;
  const isCompleteStage = stage === mapper.casePage.memo.flag.complete;
  if (isCompleteStage) return null;
  return (
    <div className="upload__button_box">
      {btnList.map((item, idx) => {
        return item.isShow &&
          <Button key={idx}
            onClick={() => handleClick({ type: "submit", name: item.name })}
            variant="contained"
            className="CreateCase__button CreateCase__button-blue float-right"
            component="span">{item.title}
          </Button>
      })}
    </div>
  )
});

const Styled = {
  CasePanel: styled.div`
    .panel{
      &.hidden{
        display:none;
      }
    }
    .MuiPaper-elevation1{
      box-shadow:none
    }
    .boundery__line{
      border:.5px solid ${color.gray_border6};
      &.bottom{
        margin-bottom:28px;
      }
    }
    .title__text{
      ${font(16, color.black_font)};
      font-weight: 700;
    }
    .MuiExpansionPanelSummary-root{
      padding:0;
    }
    .MuiExpansionPanelDetails-root{
      display:block;
      padding:5px;
    }
    .MuiExpansionPanelSummary-content.Mui-expanded {
      margin: 0;
    }
    
    .MuiButton-contained.Mui-disabled{
      border:1px solid ${color.disable_btn};
      background:white;
      box-shadow: none;
    }
    .CreateCase__button{
      ${font(18, color.white)};
      box-shadow:none;
      border-radius:2px;

      &-blue{
        padding: 5px 20px;
        background:${color.blue};
        color:white;

        &:hover{
          background:${color.blue_hover};
          box-shadow:none;
          border: none;
        }
      }
      &-white{
        border:1px solid ${color.blue};
        background:white;
        color:${color.blue};
        &:hover{
          background:white;
          box-shadow:none;
        }
      }
      &.isNotShow{
        display:none;
      }
    }
    .upload__button_box{
      width:100%;
      background:white;
      margin-top:28px;
      z-index:10;
      
      &:after{
        display:block;
        content:"";
        clear: both;
      }
      .float-right{
        float:right;
      }
    }
    .MuiExpansionPanelSummary-root.Mui-expanded{
      cursor: default !important;
    }
    .MuiExpansionPanelSummary-content{
      position:relative;
      cursor: default;
    }
    .MuiExpansionPanel-root:before{
      height:0;
      
    }
    .MuiExpansionPanelSummary-root.Mui-expanded{
      min-height: 40px;
      
    }
    /* .MuiExpansionPanel-root.Mui-expanded{
      margin: 0;
    } */
    .MuiExpansionPanelDetails-root{
      word-break:break-all;
    }
    .edit__icon{
      display:inline-block;
      background:${color.blue};
      border-radius:2px;
      color:white;
      padding:2px 5px;
      cursor: pointer;
      &.right{
        position:absolute;
        right:0;
        top:50%;
        transform:translateY(-50%);
      }
      &.font{
        ${font(16, 'white')};
        padding:0;
      }
    }
  `,
  CaseTooltip: styled.span`
     display:inline-block;
    font-size:12px;
    padding:5px;
  `
}

export default CasePanel;






















// const handleClick = (e,name) => {
//   e.stopPropagation();
//   setValues(draft => {
//     {
//       draft[name].isOpen = !draft[name].isOpen
//     }
//   })
// };

// if(['sender','receiver'].indexOf(type) !== -1){
//   setValues(draft=>{
//     draft[type].editor.content = config.data;
//   })
// }


// NOTE: Uplaod clould 버튼
{/* <Tooltip
  // arrow
  title={<Styled.CaseTooltip>생성된 케이스 데이터를 클라우드에 업로드합니다.</Styled.CaseTooltip>} placement="top-start"
  PopperProps={{
    popperOptions: {
    },
  }}
>
  <Button 
    disabled={cloudBtn.disable}
    onClick={onClick('cloud')}
    variant="contained" 
    className={cx("CreateCase__button CreateCase__button-white",{isNotShow:!cloudBtn.isShow})} 
    component="span">Upload Cloud</Button>
  
</Tooltip> */}