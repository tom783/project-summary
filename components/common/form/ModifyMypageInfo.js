import React, {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {useImmer} from 'use-immer';
import cx from 'classnames';
import { font,color} from 'styles/__utils';
import {CountrySelector} from 'components/common/input';
import _ from 'lodash';
import { CustomDatePicker } from 'components/common/input';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
// import FormControl from '@material-ui/core/FormControl';
// import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup } from '@material-ui/core';
import {
    icon_lock,
    icon_house,
    icon_person,
    icon_spot,
  } from 'components/base/images';

import {
// INFO_PARTNERS_SAGAS,
// LISTING_COUNTRY_SAGAS,
// LISTING_LOCATION_SAGAS,
INFO_INFORMATION_UPDATE_SAGAS,
CHANGE_PROFILE_SAGAS
} from 'store/actions';

import {mapper} from 'lib/mapper';

const {HANDLEEVENTTYPE} = mapper;

const initState = {
    isPublicCheck: false,
    profile: {
        value: null,
        name: '',
        fileExtension: false
    },
    storeType: {
        clinic : false,
        lab : false,
        milling : false,
    },
    storeNameTxt: '',
    managerTxt: '',
    phoneTxt: '',
    country: {
        active: true,
        current: ''
    },
    city: {
        active: false,
        current: '',
        precedeData: ''
    },
    addressTxt: '',
    licence : {
      value: null,
      name: '',
      fileExtension: false,
    },
    issueLicence: moment().unix(),
    businessLicence: {
      value: null,
      name: '',
      fileExtension: false,
    },
    submitOn : false
};

function ModifyMypageInfo(props) {
    const {
        countryData,
        cityData,
        userCode,
        info,
        openModal,
        changeControlModify
    } = props;

    const classes = useStyles();
    const [values, setValues] = useImmer(initState);

    const {
        isPublicCheck,
        profile: {name: profileName},
        storeNameTxt,
        managerTxt,
        phoneTxt,
        city : { active: cityActive },
        licence: {name: licenceName},
        issueLicence,
        addressTxt,
        businessLicence: {name : businessLicenceName},
    } = values;
    
    useEffect(() => {
        setValues(draft => {
            draft.isPublicCheck = info.open;
            draft.profile.name = info.profile? info.profile : '';
            draft.storeType = {
                clinic : info.type.clinic? info.type.clinic : false,
                lab : info.type.lab? info.type.lab : false,
                milling : info.type.milling? info.type.milling : false,
            };
            draft.storeNameTxt = info.company? info.company : '';
            draft.managerTxt = info.manager? info.manager : '';
            draft.phoneTxt = info.phone? info.phone : '';
            draft.addressTxt = info.address? info.address : '';
            draft.licence.name = info.licenseData? info.licenseData.licenseCode : '';
            draft.issueLicence = info.licenseData? moment(info.licenseData.licenseDate).unix() : moment().unix();
            draft.businessLicence.name = info.businessLicence? info.businessLicence.name : '';
        });
    }, [info]);

    /**
     * CountrySelector 컴포넌트
     * @param {*} param0 object{select: input value 값, type: select 요소 종류}
     */
    const selectRegion = useCallback(({select, type}) => {
        // console.log("input", select, type);

        if(type === 'country'){
            setValues(draft => {
                draft.country.current = select;
                draft.city.precedeData = select;
                draft.city.active = true;
                draft.city.current = '';
            });
        }
        if(type === 'city'){
            setValues(draft => {
                draft.city.current = select;
            });
        }
    },[]);

    // date picker 값을 받아옴.
    /**
     * date : object // datePicker에서 넣어주는 시간 객체
     */
    const handleDateChange = useCallback(date => {
        const moDate = date ? moment(date).unix() : moment().unix();
        setValues(draft => {
            draft.issueLicence = moDate;
        })
    }, []);


    const devInsertAccount = () => {
        setValues(draft => {
          draft.isPublicCheck = "2";
          draft.storeType = {clinic: false, lab: true, milling: true};
          draft.storeNameTxt = "변경된 가게이름";
          draft.person = "변경자";
          draft.phoneTxt = "0101010101";
          draft.addressTxt = "변경한 주소"
        })
      };

    // 체크박스 혹은 인풋박스 이벤트 관리
    /**
     * type: string
     */
    const handleChange = useCallback(type => e => {
        const inputType = (type === HANDLEEVENTTYPE.storeType) ? 'checked' : 'value';
        const targetValue = e.target[inputType];
        const typeCheckValue = e.target.value;
        let targetFile= null;

        //이미지 파일 선택시
        if(type===HANDLEEVENTTYPE.profile || type===HANDLEEVENTTYPE.licence || type===HANDLEEVENTTYPE.businessLicence){
            targetFile = e.target.files;
        }
        setValues(draft => {
        const isImageFile = [
          HANDLEEVENTTYPE.profile, 
          HANDLEEVENTTYPE.licence, 
          HANDLEEVENTTYPE.businessLicence
        ].indexOf(type) === -1? false : true;
          if (isImageFile) {
                if(targetFile.length === 1){
                    // 이미지 파일형식일때 데이터 가져오기
                  if(targetFile[0].type.startsWith('image/')){
                      draft[type].name = targetFile[0].name;
                      draft[type].value = targetFile[0];
                      draft[type].fileExtension = true;
                      
                  }else{
                      draft[type].name = '';
                      draft[type].value = null;
                      draft[type].fileExtension = false;
                  }
                }
          } else if(type===HANDLEEVENTTYPE.storeType){
              draft[type][typeCheckValue] = targetValue;
          }else {
              draft[type] = targetValue;
          }
        });
      },[]);
      
      // 수정하기 버튼 클릭 이벤트
      const onSubmit = _.debounce((value) => {
        const {
            profile: {value : profileValue},
            isPublicCheck,
            storeType,
            storeNameTxt,
            managerTxt,
            phoneTxt,
            addressTxt,
            licence: {value: licenceValue},
            issueLicence,
            businessLicence: {value: businessLicenceValue},
        } = value;
        
        const activeCountry = value.country.current !== "";
        const activeCity = value.city.current !== "";
        const reqArea = activeCountry && activeCity;
        
        const isAllTrue = [
        activeCountry,
        reqArea];

        // 데이터 확인
        if(isAllTrue.every(x => x)){
            const dataConfig = {
                "jsonType"  : "update.req.json" ,
                "userCode"  : userCode,
                "open"      : isPublicCheck,
                "type"      : storeType,
                "company"   : storeNameTxt,
                "manager"   : managerTxt,
                "phone"     : phoneTxt,
                "countryId": value.country.current,
                "statesId" : value.city.current,
                "address"  : addressTxt,
                "licenseData": storeType.lab && {
                    "licenseCode": licenceValue? licenceValue : "",
                    "licenseDate": issueLicence? moment.unix(issueLicence).format("YYYY-MM-DD") : ""
                }
            }
            
            // 이미지 파일 있으면 파일 전송요청
            if(profileValue){
                CHANGE_PROFILE_SAGAS({file: profileValue, userCode: userCode});
            }
            if(licenceValue){
              // licence image upload saga
            }
            if(businessLicenceValue){
              // businessLicence image upload saga
            }
            INFO_INFORMATION_UPDATE_SAGAS(dataConfig);
            // handleModify();
        }else{
            openModal('needData');
        }
      }, 200);

    // 버튼 클릭 이벤트 관리
    /**
     * config: {
     *  "type": string,
     *  "value": string
     * }
     */
    const handleClick = useCallback((config) => e => {
        const { type, value } = config;
        if(type === HANDLEEVENTTYPE.fileDelete){
            setValues(draft => {
                draft[value].name = '';
                draft[value].value = null;
            });
        }
    },[values]);
    
    
    return (
        <Styled.ModifyWrap>
            <form action="" className={classes.root}>
            <div className='root'>
                <div className="row addInfoRow">
                    <div className="item label">
                    <label className="input__label">
                        <span className="label__img_box">
                            <img src={icon_person} alt="icon_lock" />
                        </span>
                        <span>
                            프로필 사진
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                        <div className="contWrap">
                            <TextField
                                error={false}
                                variant="outlined"
                                placeholder={profileName}
                                disabled
                                className={cx(classes.textField, 'fileInput')}
                            />
                            <div className="file_upload_btnGnb">
                                <label htmlFor="profile" className={cx(classes.btn, `blue`, `upload`)}
                                >+ 이미지 등록
                                <input 
                                    type="file" 
                                    value=""
                                    accept=".gif,.png,.jpeg,.jpg" 
                                    id="profile" 
                                    name="profilePath" 
                                    className={cx('file')} 
                                    onChange={handleChange(HANDLEEVENTTYPE.profile)} />
                                </label>
                                <Button
                                    variant="contained"
                                    className={cx(classes.btn, `delete`, `white`)}
                                    onClick={handleClick({type: HANDLEEVENTTYPE.fileDelete, value: 'profile'})}
                                >삭제</Button>
                            </div>
                        </div>
                        <div className={cx(`input__info`)}>
                            <span className={cx(`input__info_text`, { active: false })}>* 이미지 파일(.jpg, .jpeg, .png, .gif 등)만 업로드할 수 있습니다.</span>
                        </div>
                    </div>
                </div>
                
                <div className="row addInfoRow" >
                    <div className="item label">
                    <label htmlFor="isPublic" className="input__label">
                        <span className="label__img_box">
                        <img src={icon_lock} alt="icon_lock" />
                        </span>
                        <span>
                        공개여부
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                    <RadioGroup aria-label="position" name="position" value={`${isPublicCheck}`} onChange={handleChange(HANDLEEVENTTYPE.isPublicCheck)} row>
                        <FormControlLabel
                        value="0"
                        control={<Radio color="primary" size="small" />}
                        label={<span className="mypageInfo__input public text">전체 공개</span>}
                        labelPlacement="end"

                        />
                        <FormControlLabel
                        value="1"
                        control={<Radio color="primary" size="small" />}
                        label={<span className="mypageInfo__input public text">파트너 맺은 업체에만 공개</span>}
                        labelPlacement="end"
                        />
                        <FormControlLabel
                        value="2"
                        control={<Radio color="primary" size="small" />}
                        label={<span className="mypageInfo__input public text">비공개</span>}
                        labelPlacement="end"
                        />
                    </RadioGroup>
                    <div className={cx(`input__info`)}>
                        <span className={cx(`input__info_text`, { active: false })}>* 비공개의 경우 기본적으로 타입, 업체명, 이름, 메일이 공개됩니다.</span>
                    </div>
                    </div>
                </div>

                <div className="row" >
                    <div className="item label">
                    <label htmlFor="storeName" className="input__label">
                        <span className="label__img_box">
                        <img src={icon_house} alt="icon_house" />
                        </span>
                        <span>
                        업체명
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                    <TextField
                        error={false}
                        id="storeName"
                        name="storeName"
                        value={storeNameTxt}
                        onChange={handleChange(HANDLEEVENTTYPE.storeNameTxt)}
                        variant="outlined"
                        fullWidth
                        className={cx(classes.textField)}
                    />
                    </div>
                </div>

                <div className="row" >
                    <div className="item label">
                    <label htmlFor="manager" className="input__label">
                        <span className="label__img_box">
                        <img src={icon_person} alt="icon_person" />
                        </span>
                        <span>
                        대표자
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                    <TextField
                        error={false}
                        id="manager"
                        name="manager"
                        value={managerTxt}
                        onChange={handleChange(HANDLEEVENTTYPE.managerTxt)}
                        variant="outlined"
                        fullWidth
                        className={cx(classes.textField)}
                    />
                    </div>
                </div>

                <div className="row">
                    <div className="item label">
                    <label htmlFor="type" className="input__label">
                        <span className="label__img_box">
                        <img src={icon_house} alt="icon_house" />
                        </span>
                        <span>
                            타입
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    value="clinic"
                                    color="primary"
                                    onChange={handleChange(HANDLEEVENTTYPE.storeType)}
                                    checked={!!values.storeType.clinic}
                                />
                                }
                                label="Clinic"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    value="lab"
                                    color="primary"
                                    onChange={handleChange(HANDLEEVENTTYPE.storeType)}
                                    checked={!!values.storeType.lab}
                                />
                                }
                                label="CAD Lab"
                            />
                            {/* milling은 차후 추가예정 */}
                            {/* <FormControlLabel
                                control={
                                <Checkbox
                                    value="milling"
                                    color="primary"
                                    onChange={handleChange(HANDLEEVENTTYPE.storeType)}
                                    checked={!!values.storeType.milling}
                                />
                                }
                                label="Milling"
                            /> */}
                        </FormGroup>
                    </div>
                </div>

                <div className="row" >
                    <div className="item label">
                    <label htmlFor="region" className="input__label">
                        <span className="label__img_box">
                        <img src={icon_spot} alt="icon_spot" />
                        </span>
                        <span>
                        지역
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                        <div className="contWrap country__select">
                            <CountrySelector 
                            className={classes.formControl}
                            parentState={selectRegion}
                            info={info.country_id}
                            data={countryData}
                            current={values.country.current}
                            type="country"
                            >
                                국가선택
                            </CountrySelector>
                            <CountrySelector 
                            className={classes.formControl}
                            disabled={!cityActive}
                            parentState={selectRegion}
                            info={info.states_id}
                            data={cityData}
                            current={values.city.current}
                            precedeData={values.city.precedeData}
                            type="city"
                            >
                                지역선택
                            </CountrySelector>
                        </div>
                    </div>
                </div>

                <div className="row" >
                    <div className="item label">
                    <label htmlFor="phone" className="input__label">
                        <span className="label__img_box">
                        <img src={icon_person} alt="icon_phone" />
                        </span>
                        <span>
                        연락처
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                    <TextField
                        error={false}
                        id="phone"
                        name="phone"
                        value={phoneTxt}
                        onChange={handleChange(HANDLEEVENTTYPE.phoneTxt)}
                        variant="outlined"
                        fullWidth
                        className={cx(classes.textField)}
                    />
                    </div>
                </div>

                <div className="row" >
                    <div className="item label">
                    <label htmlFor="address" className="input__label">
                        <span className="label__img_box">
                        <img src={icon_house} alt="icon_house" />
                        </span>
                        <span>
                        주소
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                    <TextField
                        error={false}
                        id="address"
                        name="address"
                        value={addressTxt}
                        onChange={handleChange(HANDLEEVENTTYPE.addressTxt)}
                        variant="outlined"
                        fullWidth
                        className={cx(classes.textField)}
                    />
                    </div>
                </div>

                <div className={`row ${!values.storeType.lab && 'hidden'}`} >
                    <div className="item label">
                    <label className="input__label">
                        <span className="label__img_box">
                        <img src={icon_person} alt="icon_phone" />
                        </span>
                        <span>
                        라이센스 발급일자
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                        <div className="date_pick">
                            <CustomDatePicker
                            value={moment.unix(issueLicence)}
                            className="CreateCase_input date"
                            onChange={handleDateChange}
                            style={{width: '100%'}}
                            />
                        </div>
                    </div>
                </div>

                <div className={`row ${!values.storeType.lab && 'hidden'}`} >
                    <div className="item label">
                    <label className="input__label">
                        <span>
                        치과기공사 면허증
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                        <div className="contWrap">
                            <TextField
                                error={false}
                                variant="outlined"
                                placeholder={licenceName}
                                disabled
                                className={cx(classes.textField, 'fileInput')}
                            />
                            <div className="file_upload_btnGnb">
                                <label htmlFor="licence" className={cx(classes.btn, `blue`, `upload`)}
                                >+ 이미지 등록
                                <input 
                                    type="file" 
                                    value=""
                                    accept=".gif,.png,.jpeg,.jpg" 
                                    id="licence" 
                                    name="licencePath" 
                                    className={cx('file')} 
                                    onChange={handleChange(HANDLEEVENTTYPE.licence)} />
                                </label>
                                <Button
                                    variant="contained"
                                    className={cx(classes.btn, `delete`, `white`)}
                                    onClick={handleClick({type: HANDLEEVENTTYPE.fileDelete, value: 'licence'})}
                                >삭제</Button>
                            </div>
                        </div>
                        <div className={cx(`input__info`)}>
                            <span className={cx(`input__info_text`, { active: false })}>* 이미지 파일(.jpg, .jpeg, .png, .gif 등)만 업로드할 수 있습니다.</span>
                        </div>
                    </div>
                </div>

                <div className={`row ${!values.storeType.clinic && 'hidden'}`} >
                    <div className="item label">
                    <label className="input__label">
                        <span>
                        사업자 등록증
                        </span>
                    </label>
                    </div>
                    <div className="item cont">
                        <div className="contWrap">
                            <TextField
                                error={false}
                                variant="outlined"
                                placeholder={businessLicenceName}
                                disabled
                                className={cx(classes.textField, 'fileInput')}
                            />
                            <div className="file_upload_btnGnb">
                                <label htmlFor="businessLicence" className={cx(classes.btn, `blue`, `upload`)}
                                >+ 이미지 등록
                                <input 
                                    type="file" 
                                    value=""
                                    accept=".gif,.png,.jpeg,.jpg" 
                                    id="businessLicence" 
                                    name="businessLicencePath" 
                                    className={cx('file')} 
                                    onChange={handleChange(HANDLEEVENTTYPE.businessLicence)} />
                                </label>
                                <Button
                                    variant="contained"
                                    className={cx(classes.btn, `delete`, `white`)}
                                    onClick={handleClick({type: HANDLEEVENTTYPE.fileDelete, value: 'businessLicence'})}
                                >삭제</Button>
                            </div>
                        </div>
                        <div className={cx(`input__info`)}>
                            <span className={cx(`input__info_text`, { active: false })}>* 이미지 파일(.jpg, .jpeg, .png, .gif 등)만 업로드할 수 있습니다.</span>
                        </div>
                    </div>
                </div>
                
            </div>
            </form>
            <div className="btnGnb">
                <Button
                    variant="contained"
                    className={cx(classes.btn, `white`, 'cancel')}
                    onClick={() => changeControlModify({isView: false})}
                >취소</Button>
                <Button
                    variant="contained"
                    className={cx(classes.btn, `blue`, 'confirm')}
                    onClick={() => onSubmit(values)}
                >완료</Button>
            </div>
        </Styled.ModifyWrap>
    );
}

const Styled = {
  ModifyWrap: styled.div `
 
    .MuiSelect-outlined.MuiSelect-outlined{
        padding: 7px 14px;
    }
    
    .MuiOutlinedInput-input{
        padding: 17px 14px;
    }
    .makeStyles-btn-218{
        height: 34px;
    }
    .row{
        display: table;
        width: 100%;

        &.addInfoRow{
            padding-bottom: 30px;
        }

        .item{
            display: table-cell;
            vertical-align: middle;
            ${font(14, color.gray_text)};
            
        }
        .label{
            width: 160px;
            &.cellTop{
                vertical-align: top;
            }
        }
        &.hidden{
            display: none;
        }
    }
    
    .row .cont{
        .contWrap{
            display: flex;
            align-items: center;

            .makeStyles-formControl-267 {
                flex: 1 1 0;
            }

            .file_upload_btnGnb {
              margin-left: 5px;
            }
        }
        .country__select, 
        .date_pick {
            width: 340px;
        }
    }

    .label__img_box{
        ${font(16, color.black_font)};
        display: none;
        opacity: 0;
    }
    
    .input__info{
        position: absolute;
        color: ${color.blue};
        padding-top: 5px;
        font-size: 12px;
    }

    .file{
        display: none;
        opacity: 0;
    }
    
    form{
        .root{
            width: 100%;
            & >div + div{
                margin-top: 25px;
            }
        }

    }
    .btnGnb {
        position: absolute;
        top: 0;
        right: 0;
        text-align: right;
        button + button{
        margin-left: 5px;
        }
        /* margin-top: 14px; */
    }
    .input__label{
      ${font(16, color.black_font)};
      font-weight: bold;
    }
    .MuiTypography-body1{
      ${font(16, color.gray_font)};
    }
    .MuiCheckbox-colorPrimary.Mui-checked{
      color: ${color.blue};
    }
    .MuiRadio-colorPrimary.Mui-checked{
      color: ${color.blue};
    }

    .MuiOutlinedInput-root{
      border-radius: 3px;
    }
   
    .MuiOutlinedInput-input .Mui-focused fieldset{
        border: 2px solid ${color.blue};
  }
  .Mui-focused .MuiOutlinedInput-notchedOutline{
      border-color:${color.blue} !important;
    }
    .MuiButton-root {
      ${font(16, color.white)};
    }
    .MuiButton-label{
      border-radius: 3px;
      &.cancel {
        ${font(16, color.blue)};
      }
    }
    `
}

const useStyles = makeStyles(theme => ({
    root: { 
      width: '100%'
    },
    textField: {
        width: "340px",
      '&.fileInput': {
        '& >div': {
            width: '100%'
        }
      }
    },
    btn: {
      display: 'inline-block',
      margin: 'auto',
      width: "80px",
      height: "40px",
      border: `1px solid #98B8CB`,
      boxShadow: 'none',

      '&.bold': {
        fontWeight: 'bold'
      },
      '&:hover': {
        border: `1px solid ${color.blue}`,
        boxShadow: 'none',
        background: `${color.btn_color_hover}`
      },
      
      '&.delete': {
        // flex: '1 1 auto',
        padding: `0 10px`,
        borderRadius: '3px',
        color: '#00A6E2',
        textTransform: 'none',
        height: "34px",
        lineHeight: "32px",
        background: `${color.white}`,
        color: `${color.blue}`,
        marginLeft: "5px",
      },
      
      '&.upload': {
          display: 'inline-flex',
          // flex: '1 1 auto',
          width: "auto",
          flexDirection: 'column',
          verticalAlign: 'top',
          cursor: 'pointer',
          padding: `0 10px`,
          borderRadius: '3px',
          background: `${color.blue}`,
          height: "34px",
          lineHeight: "32px",
          color: `white`,
          '&:hover': {
              background: `${color.blue_hover}`,
          }
      },

      '&.cancel':{
        color: "#98B8CB",
        backgroundColor: `${color.white}`,
      },
      '&.confirm': {
        color: "#fff",
        backgroundColor: `${color.btn_color}`,
    }
    },
    formControl: {
      flex : '1 1 auto',
      '& + &':{
          marginLeft: '5px'
      }
    },
    input: {
      height: 35,
    },
    label: {
      fontSize: 14,
      top: `-17%`,
    },
    eyeIcon: {
      fontSize: 15
    },
  }));

export default React.memo(ModifyMypageInfo);