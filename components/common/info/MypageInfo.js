import React, { useEffect } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";
import { font, color } from "styles/__utils";
import { TextLine } from "components/common/textLabel";
import { ModifyMypageInfo } from "components/common/form";
import cx from "classnames";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  icon_default_profile,
  icon_default_licence,
} from "components/base/images";

import { mapper } from "lib/mapper";
import { useTranslation } from "react-i18next";

const { HANDLEEVENTTYPE } = mapper;

const initState = {
  isViewModify: false,
  info: {
    profile: null,
    myCode: "",
    open: 0,
    company: "",
    manager: "",
    email: "",
    phone: "",
    address: "",
    type: [],
    country_id: 0,
    country: "",
    states_id: 0,
    state: "",
    issueLicence: "",
    licence: "",
    businessLicence: "",
  },
};

function MypageInfo(props) {
  const {
    initData,
    onClick,
    countryData,
    cityData,
    userCode,
    isViewModify,
    handleClick,
    openModal,
    changeControlModify,
  } = props;
  const classes = useStyles();
  const [valid, setValid] = useImmer(initState);
  const { t: i18nTxt } = useTranslation(); // 다국어 변환

  const textLabelSet = {
    profile: "프로필 사진",
    open: "공개여부",
    company: "업체명",
    manager: "대표자",
    type: "타입",
    regionName: "지역",
    phone: "연락처",
    address: "주소",
    issueLicence: "라이센스 발급일자",
    licence: "치과기공사 면허증",
    businessLicence: "사업자 등록증",
  };

  const styleConf = {
    _color: "#777777",
  };

  // 디폴트 프로필 이미지
  const defaultProfilePath = icon_default_profile;
  const defaultLicencePath = icon_default_licence;

  // 렌더링 시 또는 내 정보 변경이 일어났을 때 정보 세팅
  useEffect(() => {
    if (Object.keys(initData).length) {
      let koreaAuthState = "";
      if (initData.country_id === 116 && initData.licenseData) {
        if (initData.licenseData.state === 0) {
          koreaAuthState = "(신청)";
        } else if (initData.licenseData.state === 1) {
          koreaAuthState = "(인증완료)";
        } else {
          koreaAuthState = "(거부)";
        }
      }
      setValid((draft) => {
        draft.info = {
          profile: initData.profile ? initData.profile : defaultProfilePath,
          myCode: initData.myCode,
          open:
            initData.open === 0
              ? "전체 공개"
              : initData.open === 1
              ? "파트너 맺은 업체에만 공개"
              : "비공개",
          company: initData.company,
          manager: initData.manager,
          type: `${Object.keys(initData.type)
            .map((i) => {
              return initData.type[i] ? `${i.toUpperCase()}` : "";
            })
            .join(" ")}`,
          email: initData.email,
          regionName: `${
            initData.country &&
            initData.state &&
            `${initData.country} / ${initData.state}`
          }`,
          phone: initData.phone,
          address: initData.address,
          issueLicence:
            initData.licenseData &&
            moment(initData.licenseData.licenseDate).format("YYYY-MM-DD"),
          licence: initData.licenseData
            ? initData.licenseData
            : defaultLicencePath,
          businessLicence: defaultLicencePath,
        };
      });

      props.routeHistory();
    }
  }, [initData]);

  const infoTextList = Object.keys(valid.info)
    .filter((i) => i !== "email" && i !== "myCode")
    .map((i, index) => {
      const textLineType =
        ["profile", "licence", "businessLicence"].indexOf(i) !== -1
          ? "img"
          : "txt";
      const hasLabelLicence = ["licence", "issueLicence"].indexOf(i) !== -1;
      const hasLabelBusiness = ["businessLicence"].indexOf(i) !== -1;
      let isRenderTextLine = true;

      if (hasLabelLicence) {
        if (initData.type && initData.type.lab) {
          isRenderTextLine = true;
        } else {
          isRenderTextLine = false;
        }
      }
      if (hasLabelBusiness) {
        if (initData.type && initData.type.clinic) {
          isRenderTextLine = true;
        } else {
          isRenderTextLine = false;
        }
      }

      if (isRenderTextLine) {
        return (
          <TextLine
            key={index}
            styleConf={styleConf}
            className={
              ["licence", "businessLicence"].indexOf(i) !== -1
                ? "licence_cont"
                : ""
            }
            cont={{
              label: textLabelSet[i],
              value: valid.info[i],
              type: textLineType,
            }}
          />
        );
      }
    });

  return (
    <Styled.MyPageWrap>
      <div className="account">
        <div className="wrap_title">
          <span className="title">계정 정보</span>
        </div>
        <div className="wrap_cont">
          <Styled.MypageListBox>
            <TextLine
              styleConf={styleConf}
              cont={{
                label: "이메일 주소",
                value: valid.info.email,
                type: "txt",
              }}
            />
            <TextLine
              styleConf={styleConf}
              cont={{
                label: "고유번호",
                value: valid.info.myCode,
                type: "txt",
              }}
            />
            <TextLine
              styleConf={styleConf}
              cont={{
                label: "비밀번호 변경",
                value: (
                  <Button
                    variant="contained"
                    className={cx(classes.passwordChange)}
                    onClick={handleClick({
                      type: HANDLEEVENTTYPE.passwordChange,
                    })}
                  >
                    비밀번호 변경하기
                  </Button>
                ),
                type: "txt",
              }}
            />
          </Styled.MypageListBox>
        </div>
      </div>
      <div className="basic">
        <div className="wrap_title">
          <span className="title">기본정보</span>
          {isViewModify ? null : (
            <Button
              variant="contained"
              className={cx(classes.modify)}
              onClick={() => changeControlModify({ isView: true })}
            >
              수정
            </Button>
          )}
        </div>
        <div className="wrap_cont">
          {isViewModify ? (
            <ModifyMypageInfo
              onClick={onClick}
              countryData={countryData}
              cityData={cityData}
              handleModify={handleClick}
              info={initData}
              userCode={userCode}
              openModal={openModal}
              changeControlModify={changeControlModify}
            />
          ) : (
            <Styled.MypageListBox>
              <>{infoTextList}</>
            </Styled.MypageListBox>
          )}
        </div>
      </div>
    </Styled.MyPageWrap>
  );
}

const useStyles = makeStyles((theme) => ({
  modify: {
    margin: "auto",
    border: `1px solid ${color.btn_color}`,
    background: `${color.btn_color}`,
    boxShadow: "none",
    color: "#fff",
    fontSize: "16px",
    height: "40px",
    padding: "0 19px",
    "&.bold": {
      fontWeight: "bold",
    },
    "&:hover": {
      border: `1px solid ${color.btn_color_hover}`,
      boxShadow: "none",
      background: `${color.btn_color_hover}`,
    },
  },
  passwordChange: {
    border: "1px solid #CACFD2",
    backgroundColor: "#FAFAFA",
    padding: "0 13px",
    height: "30px",
    fontSize: "14px",
    color: "#555555",
    boxShadow: "none",
  },
}));

const Styled = {
  MyPageWrap: styled.div`
    display: flex;
    padding: 36px;

    .account {
    }

    .basic {
      position: relative;
      flex: 1 1 0;
      margin-left: 100px;
    }

    .wrap_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-family: Noto Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 25px;
        color: #242f35;
      }
      button {
        margin: 0;
      }
    }

    .wrap_cont {
      margin-top: 30px;
      margin-left: 45px;
    }
  `,
  MypageListBox: styled.div`
    position: relative;
    div + div {
      margin-top: 25px;
    }

    .txtLabel {
      ${font(16, color.black_font)};
    }
    .cont {
      ${font(16, color.gray_font)};
    }

    .licence_cont {
      display: inline-block;

      img {
        display: inline-block;
        width: 100px;
        height: 140px;
      }
    }

    .licence_cont + .licence_cont {
      margin-left: 50px;
    }
  `,
};

export default React.memo(MypageInfo);
