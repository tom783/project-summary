import React from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { color, font } from 'styles/__utils';
import { ENV_MODE_DEV } from 'lib/setting';
import { useImmer } from 'use-immer';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TermsOfUseInfo } from 'components/base/terms';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormGroup from '@material-ui/core/FormGroup';
import { VisibleEyes } from 'components/common/icon';
import { CustomDatePicker } from 'components/common/input';
import _ from 'lodash';
import moment from 'moment';
import { useDidUpdateEffect } from 'lib/utils';
// import { convertDateTime } from 'lib/library';
import {mapper} from 'lib/mapper';

import {
  icon_lock,
  icon_house,
  icon_person,
  icon_spot,
  icon_email,
  icon_key,
  icon_check,
} from 'components/base/images';


const {BRAND, HANDLEEVENTTYPE} = mapper;

const SignUpState = {
  isPublicCheck: "0",
  storeName: "",
  nickname: "",
  manager: "",
  userType: {
    clinic: false,
    lab: false,
    milling: false
  },
  conutry: {
    active: true,
  },
  city: {
    active: true,
  },
  email: {
    value: "",
    valid: false,
  },
  verificationCode: {
    value: "",
  },
  password: {
    value: '',
    show: false,
  },
  checkPassword: {
    value: '',
    show: false,
  },
  licence : {
    value: null,
    name: '',
    fileExtension: false,
  },
  licenseDate: {
    value: moment().unix(),
  },
  businessLicence: {
    value: null,
    name: '',
    fileExtension: false,
  },
}

function SignUpForm({
  onSubmit,
  error,
  countryData,
  cityData,
  onChange,
  onClick,
}) {
  const classes = useStyles();
  const [values, setValues] = useImmer(SignUpState);
  const {
    isPublicCheck,
    storeName,
    manager,
    email            : { value: emailVal },
    password         : { value: passwordVal, show: passwordShow },
    checkPassword    : { value: checkPasswordVal, show: checkPasswordShow },
    city             : { active: cityActive },
    verificationCode : { value: verificationCodeVal },
    licence          : { name: licenceName },
    licenseDate      : { value: licenseDateVal },
    businessLicence  : {name : businessLicenceName},
    userType         : userTypeVal
  } = values;

  const {
    email         : { isVaild: errorEmail, regEmail: isRegEmail, isVaildAttempt: errorAttempEmail },
    verifyCode    : { isVaild: errorVerifyCode, regVerifyCode: isRegVerifyCode },
    password      : { isVaild: errorPassword, regPassword: isRegPassword },
    checkPassword : { isVaild: errorCheckPassword },
    manager       : { regManagerName: isRegManagerName },
    country       : { isVaild: errorCountry },
    city          : { isVaild: errorCity },
    license       : { isVaild: isRegLicense }
  } = error;

  const licenceCountrySeqList = [116];
  const isViewLicence = licenceCountrySeqList.indexOf(countryData.current) !== -1 && values.userType.lab;
  const isViewBusiness = values.userType.clinic;

  // NOTE: signup change event
  const handleChange = _.throttle((prop, e) => {
    const isPropRememberOrAuto = ['remember', 'auto'].indexOf(prop) !== -1;
    const isPropUserType = prop === 'userType';
    const isPropLicenseDate = prop === 'licenseDate';
    const inputType = isPropRememberOrAuto ? 'checked' : 'value';
    const targetValue = isPropLicenseDate ? ( e ? moment(e).unix() : moment().unix()) : e.target[inputType];
    const targetValueChangeType = [
      'email',
      'password',
      'checkPassword',
      'city',
      'country',
      'verificationCode',
      'licenseDate'];

    let targetFile= null;
    const isImageFile = [
      HANDLEEVENTTYPE.licence, 
      HANDLEEVENTTYPE.businessLicence
    ].indexOf(prop) === -1? false : true;

    if(isImageFile){
        targetFile = e.target.files;
    }
    

    setValues(draft => {
      const isIncludeChangeType = targetValueChangeType.indexOf(prop) !== -1;
      if (isIncludeChangeType || isPropLicenseDate) {
        draft[prop].value = targetValue;
      } else if (isPropUserType) {
        draft[prop][targetValue] = !userTypeVal[targetValue];
      } else if(isImageFile){
        if(targetFile.length === 1){
          // 이미지 파일형식일때 데이터 가져오기
          if(targetFile[0].type.startsWith('image/')){
              draft[prop].name = targetFile[0].name;
              draft[prop].value = targetFile[0];
              draft[prop].fileExtension = true;
              
          }else{
              draft[prop].name = '';
              draft[prop].value = null;
              draft[prop].fileExtension = false;
          }
      }
      } else {
        draft[prop] = targetValue;
      }
    });
  }, 30);

  // NOTE: signup click event
  const handleClick = (config) => e => {
    const { type, value } = config;
    const isTypeVerify = type === 'verify';
    const isTypeEyeIcon = type === 'eyeIcon';
    const isTypeSelected = type === 'selected';
    const isValueCountry = value === 'country';
    const isTypeSubmit = type === 'submit';
    const isTypePreventDefault = type === 'preventDefault';
    const isFileDelete = type === HANDLEEVENTTYPE.fileDelete;

    if (isTypeVerify) {
      const valueObj = {
        email: () => onClick({
          type: "verify", name: "email", value: {
            email: emailVal,
            verifyCode: verificationCodeVal
          }
        }),
        verificationCode: () => onClick({
          type: "verify", name: "verifyCode", value: {
            email: emailVal,
            verifyCode: verificationCodeVal
          }
        })
      }
      const fnClickValue = valueObj[value];
      if (fnClickValue) fnClickValue();

    } else if (isTypeEyeIcon) {
      setValues(draft => {
        draft[value].show = !draft[value].show;
      });
    } else if (isTypeSelected) {
      if (isValueCountry) {
        setValues(draft => {
          draft.city.active = true;
        });
      }
      onChange({
        type: value,
        value: e.target.value
      })
    } else if (isTypeSubmit) {
      let licenseDate = values.licenseDate.value;
      const hasLicenseDate = isNaN(licenseDate) || licenseDate < 0;
      licenseDate = hasLicenseDate ? "" : moment.unix(licenseDate).format('YYYY-MM-DD');
      onSubmit({
        ...values,
        licenseDate: { value: licenseDate },
        license: isViewLicence
      });
    } else if (isTypePreventDefault) {
      e.preventDefault();
    }else if(isFileDelete){
        setValues(draft => {
            draft[value].name = '';
            draft[value].value = null;
        });
    }
  }

  // NOTE: 개발 테스트 버튼 함수
  const devInsertAccount = value => {
    if (value === 'logout') {
      console.log('logout');
    } else {
      setValues(draft => {

        draft.storeName = '아무개 업체'
        draft.email.value = "monster2jy@gmail.com";
        draft.email.vaild = true;
        draft.city.active = true;
        draft.nickname = "아무개";
        draft.manager = "아무개대표";
        draft.password.value = "dof0070!";
        draft.checkPassword.value = "dof0070!";
        draft.password.show = true;
        draft.checkPassword.show = true;
        draft.userType.lab = true;
        draft.verificationCode.value = 'q1w2e3r4';
        draft.licenseCode.value = "1254-214-215";
        draft.licenseDate.value = moment().unix();
      })

    }
  };

  // NOTE: didmount 함수 
  useDidUpdateEffect(() => {
    if (!isViewLicence && isNaN(licenseDateVal)) {
      setValues(draft => {
        draft.licenseDate.value = moment().unix();
      })
    }
  }, [isViewLicence])

  return (
    <Styled.SignUpForm>
      <h1 className="signup__title">{BRAND.logo.text} 계정 만들기
      {ENV_MODE_DEV && true && <>
        <Button
          variant="contained"
          color="inherit"
          style={{ marginBottom: 20 }}
          onClick={() => devInsertAccount()}
        >
          Dev Test
        </Button>
        </>}
      </h1>

      <form action="" className={classes.root}>
        <Grid container spacing={3}>
          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="isPublic" className="input__label">
                <span className="label__img_box">
                  <img src={icon_lock} alt="icon_lock" />
                </span>
                <span>
                  공개여부
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <RadioGroup aria-label="position" name="position" value={isPublicCheck} onChange={(e) => handleChange(`isPublicCheck`, e)} row>
                <FormControlLabel
                  value={"0"}
                  control={<Radio color="primary" size="small" />}
                  label={<span className="signup__input public text">전체 공개</span>}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={"1"}
                  control={<Radio color="primary" size="small" />}
                  label={<span className="signup__input public text">파트너 맺은 업체에만 공개</span>}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={"2"}
                  control={<Radio color="primary" size="small" />}
                  label={<span className="signup__input public text">비공개</span>}
                  labelPlacement="end"
                />
              </RadioGroup>
              <div className={cx(`input__info`)}>
                <span className={cx(`input__info text`, { active: false })}>-</span>
              </div>
            </Grid>
          </Grid>

          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="storeName" className="input__label">
                <span className="label__img_box">
                  <img src={icon_house} alt="icon_house" />
                </span>
                <span>
                  업체명
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <TextField
                error={false}
                id="storeName"
                name="storeName"
                value={storeName}
                onChange={(e) => handleChange(`storeName`, e)}
                variant="outlined"
                autoComplete="off"
                fullWidth
                inputProps={{
                  maxLength: 25,
                }}
              />
              <div className={cx(`input__info`)}>
                <span className={cx(`input__info text`, { active: false })}>-</span>
              </div>
            </Grid>
          </Grid>

          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="nickname" className="input__label">
                <span className="label__img_box">
                  <img src={icon_person} alt="icon_mypage_person" />
                </span>
                <span>
                  대표자
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <TextField
                error={false}
                id="manager"
                value={manager}
                name="manager"
                onChange={(e) => handleChange(`manager`, e)}
                variant="outlined"
                autoComplete="off"
                fullWidth
                inputProps={{
                  maxLength: 25,
                }}
              />
              <div className={cx(`input__info`)}>
                <span className={cx(`input__info text`, { active: isRegManagerName === false })}>
                  *대표자를 확인해주세요.
                </span>
              </div>
            </Grid>
          </Grid>

          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="userType" className="input__label">
                <span className="label__img_box">
                  <img src={icon_lock} alt="icon_lock" />
                </span>
                <span>
                  타입
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <FormGroup
                aria-label="position"
                name="position"
                onChange={(e) => handleChange(`userType`, e)} row
                className="signup__type_group"
              >
                <FormControlLabel
                  value={"clinic"}
                  control={<Checkbox checked={userTypeVal.clinic} color="primary" size="small" />}
                  label={<span className="signup__input public text">클리닉</span>}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={"lab"}
                  control={<Checkbox checked={userTypeVal.lab} color="primary" size="small" />}
                  label={<span className="signup__input public text">기공소</span>}
                  labelPlacement="end"
                />
                {/* <FormControlLabel
                  value={"milling"}
                  control={<Checkbox checked={userTypeVal.milling} color="primary" size="small" />}
                  label={<span className="signup__input public text">밀링센터</span>}
                  labelPlacement="end"
                /> */}
              </FormGroup>
              <div className={cx(`input__info`)}>
                <span className={cx(`input__info text`, { active: false })}>-</span>
              </div>
            </Grid>
          </Grid>

          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="area" className="input__label">
                <span className="label__img_box">
                  <img src={icon_spot} alt="icon_spot" />
                </span>
                <span>
                  지역
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <FormControl className={classes.formControl} variant="outlined">
                    <Select
                      value={countryData.current}
                      onChange={handleClick({ type: 'selected', value: 'country' })}
                      displayEmpty
                      className={classes.selectEmpty}
                    >
                      <MenuItem disabled value="">
                        <em>국가선택</em>
                      </MenuItem>
                      {Array.isArray(countryData.list) && countryData.list.map(item => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl className={classes.formControl} disabled={!cityActive} variant="outlined">
                    <Select
                      value={cityData.current}
                      onChange={handleClick({ type: "selected", value: "city" })}
                      displayEmpty
                      className={classes.selectEmpty}
                    >
                      <MenuItem disabled value="">
                        <em>선택</em>
                      </MenuItem>
                      {Array.isArray(cityData.list) && cityData.list.map(item => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <div className={cx(`input__info`)}>
                <span className={cx(`input__info text`, { active: errorCountry === false || errorCity === false })}>
                  *국가 or 지역을 확인해주세요.
                </span>
              </div>
            </Grid>
          </Grid>

          {isViewLicence &&
            <>
              <Grid container >
                <Grid item xs={3}>
                  <label htmlFor="licenseCode" className="input__label">
                    <span className="label__img_box">
                      <img src={icon_email} alt="icon_email" />
                    </span>
                    <span>
                    치과기공사 자격증
                    </span>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <Grid container spacing={1}>
                    <Grid item xs={7} className="fileInput_txt">
                      <TextField
                          error={false}
                          variant="outlined"
                          placeholder={licenceName}
                          disabled
                          className={cx(classes.textField, 'fileInput')}
                      />
                    </Grid>
                    <Grid item xs={5} className="fileInput_btn">
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
                            onChange={e => handleChange(HANDLEEVENTTYPE.licence, e)} />
                        </label>
                        <Button
                            variant="contained"
                            className={cx(classes.btn, `delete`, `white`)}
                            onClick={handleClick({type: HANDLEEVENTTYPE.fileDelete, value: 'licence'})}
                        >삭제</Button>
                      </div>
                    </Grid>
                  </Grid>
                  <div className={cx(`input__info `)}>
                    <span className={cx(`input__info_text`, { active: false })}>* 이미지 파일(.jpg, .jpeg, .png, .gif 등)만 업로드할 수 있습니다.</span>
                  </div>
                </Grid>
              </Grid>

              <Grid container >
                <Grid item xs={3}>
                  <label className="input__label">
                    <span className="label__img_box">
                      <img src={icon_email} alt="icon_email" />
                    </span>
                    <span>
                    자격증 발급일자
                    </span>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <div className="date_pick">
                      <CustomDatePicker
                      value={moment.unix(licenseDateVal)}
                      className="CreateCase_input date"
                      onChange={(e) => handleChange(`licenseDate`, e)}
                      style={{width: '100%'}}
                      />
                  </div>
                  <div className={cx(`input__info`)}>
                    <span className={cx(`input__info text`, { active: false })}>-</span>
                  </div>
                </Grid>
              </Grid>
            </>
          }
          {isViewBusiness &&
            <Grid container >
              <Grid item xs={3}>
                <label htmlFor="licenseCode" className="input__label">
                  <span className="label__img_box">
                    <img src={icon_email} alt="icon_email" />
                  </span>
                  <span>
                  사업자 등록증
                  </span>
                </label>
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={1}>
                  <Grid item xs={7} className="fileInput_txt">
                    <TextField
                      error={false}
                      variant="outlined"
                      placeholder={businessLicenceName}
                      disabled
                      className={cx(classes.textField, 'fileInput')}
                    />
                  </Grid>
                  <Grid item xs={5} className="fileInput_btn">
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
                          onChange={e => handleChange(HANDLEEVENTTYPE.businessLicence, e)} />
                      </label>
                      <Button
                          variant="contained"
                          className={cx(classes.btn, `delete`, `white`)}
                          onClick={handleClick({type: HANDLEEVENTTYPE.fileDelete, value: 'businessLicence'})}
                      >삭제</Button>
                    </div>
                  </Grid>
                </Grid>
                <div className={cx(`input__info `)}>
                  <span className={cx(`input__info_text`, { active: false })}>* 이미지 파일(.jpg, .jpeg, .png, .gif 등)만 업로드할 수 있습니다.</span>
                </div>
              </Grid>
            </Grid>
          }

          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="email" className="input__label">
                <span className="label__img_box">
                  <img src={icon_email} alt="icon_email" />
                </span>
                <span>
                  이메일주소
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <TextField
                    // error={errorEmail}
                    id="email"
                    value={emailVal}
                    name="email"
                    onChange={(e) => handleChange(`email`, e)}
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={2} className="flx-end">
                  <Button
                    variant="contained"
                    className={cx(classes.btn, `blue`)}
                    onClick={handleClick({ type: "verify", value: 'email' })}
                  >확인</Button>
                </Grid>
              </Grid>
              <div className={cx(`input__info email`)}>
                <span className={cx(`input__info text`, { active: (errorEmail || isRegEmail === false || errorAttempEmail) })}>
                  {isRegEmail === false && '*이메일 형식이 맞지 않습니다'}
                  {errorEmail && "*사용 중인 이메일 주소입니다. 다른 메일주소를 입력해주세요"}
                  {isRegEmail && errorAttempEmail && "*이메일 인증을 진행해주세요"}
                  {/* 중복 or 인증코드 전송 */}
                  .
              </span>
              </div>
            </Grid>
          </Grid>

          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="verificationCode" className="input__label">
                <span className="label__img_box">
                  <img src={icon_email} alt="icon_email" />
                </span>
                <span>
                  인증코드
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <TextField
                    // error={errorEmail}
                    id="verificationCode"
                    value={verificationCodeVal}
                    name="verificationCode"
                    onChange={(e) => handleChange(`verificationCode`, e)}
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={2} className="flx-end">
                  <Button
                    variant="contained"
                    className={cx(classes.btn, `blue`)}
                    onClick={handleClick({ type: "verify", value: `verificationCode` })}
                  >인증</Button>
                </Grid>
              </Grid>
              <div className={cx(`input__info email`)}>
                <span className={cx(`input__info text`, { active: errorVerifyCode || isRegVerifyCode === false })}>
                  *인증코드를 확인해주세요.
              </span>
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
              <label htmlFor="password" className="input__label">
                <span className="label__img_box">
                  <img src={icon_key} alt="icon_key" />
                </span>
                <span>
                  비밀번호
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <OutlinedInput
                // error={errorPassword}
                id="password"
                type={passwordShow ? 'text' : 'password'}
                value={passwordVal}
                onChange={(e) => handleChange('password', e)}
                className={classes.input}
                autoComplete="off"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClick({ type: "eyeIcon", value: `password` })}
                      onMouseDown={handleClick({ type: "preventDefault" })}
                      edge="end"
                      className={classes.eyeIcon}
                    >
                      <VisibleEyes show={values.password.show} />

                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={0}
              />
              <div className={cx(`input__info password`)}>
                <span className={cx(`input__info text`, { active: errorPassword || isRegPassword === false })}>
                  *8자 이상 16자 이하의 문자, 숫자 및 특수 문자를 조합하여 설정해주세요.
              </span>
              </div>
            </Grid>
          </Grid>

          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="checkPassword" className="input__label">
                <span className="label__img_box">
                  <img src={icon_check} alt="icon_check" />
                </span>
                <span>
                  비밀번호확인
              </span>
              </label>
            </Grid>
            <Grid item xs={9}>
              <OutlinedInput
                // error={errorPassword}
                id="checkPassword"
                type={checkPasswordShow ? 'text' : 'password'}
                value={checkPasswordVal}
                onChange={(e) => handleChange('checkPassword', e)}
                className={classes.input}
                autoComplete="off"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClick({ type: "eyeIcon", value: `checkPassword` })}
                      onMouseDown={handleClick({ type: "preventDefault" })}
                      edge="end"
                      className={classes.eyeIcon}
                    >
                      <VisibleEyes show={values.checkPassword.show} />
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={0}
              />
              <div className={cx(`input__info checkPassword`)}>
                <span className={cx(`input__info text`, { active: errorCheckPassword })}>
                  *비밀번호가 일치하지 않습니다.
              </span>
              </div>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12}>
            <div className="signup__btn_box">
              <Button
                variant="contained"
                color="primary"
                className={cx(classes.btn, 'signup bold')}
                name="user"
                onClick={handleClick({ type: "submit" })}>
                동의하고 계정 생성하기
            </Button>
            </div>
          </Grid>

        </Grid>
      </form>
      <TermsOfUseInfo />
      <p className="signup__info login">이미 계정이 있으신가요?
        <span className="login__info"><Link to="/auth/signin">로그인하기</Link></span>
      </p>

    </Styled.SignUpForm>
  );
}


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  selectEmpty: {
    // height:200
  },
  textField: {
    width: '100%',
    marginBottom: 25,

    '&.fileInput': {
      marginBottom: '0',
      '& >div': {
        width: '100%'
      }
    }
  },
  btn: {
    display: 'inline-block',
    margin: 'auto',
    border: `1px solid ${color.blue}`,
    boxShadow: 'none',
    '&.bold': {
      fontWeight: 'bold'
    },
    '&:hover': {
      border: `1px solid ${color.blue}`,
    },
    '&.signup': {
      width: `300px`,
      background: `${color.blue}`,
      '&:hover': {
        boxShadow: 'none',
        background: `${color.blue_hover}`
      },
    },
    '&.blue': {
      color: `white`,
      background: `${color.blue}`,
      '&:hover': {
        boxShadow: 'none',
        background: `${color.blue_hover}`
      },
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

  },
  formControl: {
    width: `100%`
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

const Styled = {
  SignUpForm: styled.div`
    width:620px;
    margin:auto;
    margin-top:70px;
    margin-bottom:70px;
    .MuiOutlinedInput-root{
        border-radius: 3px;
    }
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline{
        border-color:${color.blue}
      }
    .MuiMenu-paper{
        max-height:200px;
    }
    .signup__info{
        margin-top:20px;
      ${font(12, color.gray_font)};
      &.login{
        text-align:center;
      }
    }
    .signup__title{
        ${font(27, color.gray_font)};
      text-align:center;
      margin-bottom:50px;
    }
    .signup__btn_box{
      margin-bottom:12px;
      margin-top:30px;
      text-align:center;
    }
    .login__info{
        ${font(12, color.blue_font)};
      font-weight:bold;
      margin-left:10px;
      &:hover{
        text-decoration:underline;
      text-underline-position:under;
    }
  }
    .signup__input{
      &.public.text{
        ${font(12, color.gray_font)};
    }
  }
    .input__info{
      padding:0px 0;
      padding-bottom:5px;
      &.text{
        transition:.3s;
        opacity:0;
        ${font(12, color.blue_font)};
        color:${color.blue};
          &.active{
            opacity:1;
          }
      }
    }
    .file{
        display: none;
        opacity: 0;
    }
    .label__img_box{
        margin-right:5px;
      opacity:0;
      &>img{
        position:relative;
        top:2px;
        width:14px;
        height:16px;
      }
    }
    .input__label{
        position:relative;
        top:8px;
        display:block;
        ${font(14, color.black_font)};
        font-weight:bold;
        &.licenseCode{
          top:12px;
      }
    }
    .fileInput_txt {
      min-width: 61%;
      flex-basis: 61%;
    }
    .fileInput_btn {
      display: flex;
      justify-content: flex-end;
      min-width: 39%;
      flex-basis: 39%;
    }
    .flx-end {
      display: flex;
      justify-content: flex-end;
    }

    .MuiSelect-outlined.MuiSelect-outlined{
        padding:10px ;
    }
    .MuiInputBase-root.Mui-focused{
      box-shadow:none;
      outline:none;
    }
    .MuiRadio-colorPrimary.Mui-checked{
        color: ${color.blue};
    }
    .makeStyles-btn-8{
        border-radius: 3px;
    }
    .MuiCheckbox-colorPrimary.Mui-checked{
      color:${color.blue};
    }
    .MuiFormHelperText-root.Mui-error{
      display:none;
    }
    .CreateCase_input.date .MuiIconButton-root{
      padding:0;
    }
    .CreateCase_input.date .MuiInputBase-root{
      font-size:14px;
    }

    .signup__type_group .MuiSvgIcon-fontSizeSmall{
      font-size:21px;
      font-weight:400;
    }
    /* .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline{
      border-color:transparent;
    } */
  `
}

export default SignUpForm;










{/* <TextField
    // error={errorEmail}
    id="licenseDate"
    value={licenseDateVal}
    name="licenseDate"
    onChange={(e) => handleChange(`licenseDate`, e)}
    variant="outlined"
    fullWidth
    autoComplete="off"
  /> */}
{/* <Grid container >
  <Grid item xs={3}>
    <label htmlFor="nickname" className="input__label">
      <span className="label__img_box">
        <img src={icon_person} alt="icon_mypage_person" />
      </span>
      <span>
        담당자
    </span>
    </label>
  </Grid>
  <Grid item xs={8}>
    <TextField
      error={false}
      id="nickname"
      value={nickname}
      name="nickname"
      onChange={(e)=>handleChange(`nickname`,e)}
      variant="outlined"
      autoComplete="off"
      fullWidth
      inputProps={{
        maxLength: 25,
      }}
    />
    <div className={cx(`input__info`)}>
      <span className={cx(`input__info text`, { active: isRegNickName === false })}>
        *담당자을 확인해주세요.
      </span>
    </div>
  </Grid>
</Grid> */}
