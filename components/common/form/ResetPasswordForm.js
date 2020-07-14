import React, {useCallback} from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import {  color, font } from 'styles/__utils';
import { useImmer } from 'use-immer';
import {regEmail, regPassword} from 'lib/library';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {mapper} from 'lib/mapper';

import {
  icon_email,
  icon_key,
  icon_check,
} from 'components/base/images';

const {HANDLEEVENTTYPE} = mapper;

const initState = {
  email: {
    value: '',
    valid: false,
    regEmail: null
  },
  verifyCode: {
    value: ''
  },
  password: {
    value: '',
    show: false,
    regPassword: null
  },
  checkPassword: {
    value: '',
    show: false,
    regPassword: null
  }
}

function ResetPasswordForm(props) {
  const {
    validCheck, 
    handleClick, 
    handleSubmit,
    authTimer
  } = props;
  const classes = useStyles();
  const [values, setValues] = useImmer(initState);

  const {
    email:{value: emailVal, regEmail: isRegEmail},
    verifyCode,
    password:{value: passwordVal, regPassword: isRegPass, show: isPasswordShow},
    checkPassword:{value: checkPasswordVal, regPassword: isRegCheckPass, show: isCheckPasswordShow},
  } = values;

  const devInsertAccount = () => {
    setValues(draft => {
      draft.email.value = "hello@gmail.com";
      draft.password.value = "test1234!@";
      draft.password.show = true;
      draft.checkPassword.value = "test1234!@";
      draft.checkPassword.show = true;
      draft.verifyCode.value = 'testCode';
    })
  };


  const handleMouseDownPassword = useCallback(event => {
    event.preventDefault();
  },[]);

// input type password <=> txt 로 변경시 아이콘 변경
  const iconPasswordVisible = value => { 
      return values[value].show
    ? <Visibility className={classes.eyeIcon} />
    : <VisibilityOff className={classes.eyeIcon} />
}
  const { 
    email: errorEmail, 
  } = validCheck;
  
// change 이벤트 값 관리
/** 
 * stateKey : string // input event 에 해당하는 state 키값
*/
  const handleChange = useCallback(stateKey => e => {
    const targetValue = e.target.value;
    setValues(draft => {
      draft[stateKey].value = targetValue;
    });
  },[]);

// click 이벤트 관리
/** 
 * config : { "type" : string, "stateKey": string}
*/
  const onClick = useCallback((config) =>{
    const {
      type,
      stateKey
    } = config;
    if(type === HANDLEEVENTTYPE.sendEmail){
        setValues(draft=>{
          draft.email.regEmail = false;
        });
        if(regEmail(emailVal)){
          setValues(draft=>{
            draft.email.regEmail = true;
          });
          
          handleClick({
            type: HANDLEEVENTTYPE.sendEmail, 
            email: emailVal, 
          });
        }
        
    }else if(type === HANDLEEVENTTYPE.authCodeCheck){
      handleClick({
        type:HANDLEEVENTTYPE.authCodeCheck, 
        email: emailVal, 
        inputAuthCode: verifyCode.value, 
      });
    }else if(type === HANDLEEVENTTYPE.eyeIcon){
      setValues(draft => {
        draft[stateKey].show = !draft[stateKey].show;
      });
    }
  },[emailVal, verifyCode]);

// submit 버튼 클릭 이벤트 관리
  const onSubmit = _.debounce(useCallback(() => {
    if(passwordVal === checkPasswordVal){
      if(regPassword(passwordVal)){
        setValues(draft => {
          draft.password.regPassword = true;
          draft.checkPassword.regPassword = true;
        });
        if(regEmail(emailVal)){
          setValues(draft => {
            draft.email.regEmail = true;
          });
          handleSubmit({
            type: HANDLEEVENTTYPE.resetPassword,
            email: emailVal, 
            password: passwordVal, 
            checkPassword: checkPasswordVal
          });
        }else{
          setValues(draft => {
            draft.email.regEmail = false;
          });
        }

      }else{
        setValues(draft => {
          draft.password.regPassword = false;
          draft.checkPassword.regPassword = null;
          draft.email.regEmail = regEmail(emailVal)? true : false;
        });
      }
    }else{
      setValues(draft => {
        draft.checkPassword.regPassword = false;
      });
    }
  },[passwordVal, checkPasswordVal, emailVal]),200);
  
  return (
    <Styled.ResetPasswordForm>
      <button onClick={devInsertAccount} >dev</button>
      <h1 className="resetPass__title">비밀번호 재설정하기</h1>
      <form action="" className={classes.root}>
        <Grid container spacing={3}>
          <Grid container>
            <Grid item xs={3}>
              <label htmlFor="email" className="input__label">
                <span className="label__img_box">
                  <img src={icon_email} alt="icon_email"/>
                </span>
                <span>
                  이메일주소
                </span>
              </label>  
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <TextField
                    id="email"
                    value={emailVal}
                    name="email"
                    onChange={handleChange('email')}
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={4} >
                  <Button
                    variant="contained" 
                    className={cx(classes.btn,`blue`)}
                    onClick={()=>onClick({type:HANDLEEVENTTYPE.sendEmail})}
                  >인증코드 전송</Button>
                </Grid>
              </Grid>
              <div className={cx(`input__info email`)}>
                <span className={cx(`input__info text`,{active:(errorEmail === false || isRegEmail === false)})}>
                {isRegEmail===false
                ?'*이메일 형식이 맞지 않습니다.'
                :"* 이메일을 확인해주세요."
                }
                
                </span>
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
              <label htmlFor="verifyCode" className="input__label">
                <span className="label__img_box">
                  <img src={icon_email} alt="icon_email"/>
                </span>
                <span>
                  인증코드입력
                </span>
              </label>  
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                <Grid item xs={9} className="verifyTag">
                  <TextField
                    id="verifyCode"
                    value={verifyCode.value}
                    name="email"
                    onChange={handleChange('verifyCode')}
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                  />
                  <div className={cx(`input__info`)}>
                    <span className={cx(`input__info text`,{active:false})}>-</span>
                  </div>
                  <div className="verify_count">
                    <span className={`timer ${authTimer.active? 'active': ''}`}>{authTimer.viewTime}</span>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <Button 
                    variant="contained" 
                    className={cx(classes.btn,`blue`)}
                    onClick={()=>onClick({type:HANDLEEVENTTYPE.authCodeCheck})}
                  >확인</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
              <label htmlFor="password" className="input__label">
                <span className="label__img_box">
                  <img src={icon_key} alt="icon_key"/>
                </span>
                <span>
                  비밀번호
                </span>
              </label>  
            </Grid>
            <Grid item xs={8}>
            <OutlinedInput
                // error={errorPassword}
                id="password"
                type={isPasswordShow ? 'text' : 'password'}
                value={passwordVal}
                onChange={handleChange('password')}
                className={classes.input}
                autoComplete="off"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={()=>onClick({type:HANDLEEVENTTYPE.eyeIcon,stateKey:'password'})}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      className={classes.eyeIcon}
                    >
                      {iconPasswordVisible(`password`)}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={0}
              />
              <div className={cx(`input__info password`)}>
                <span className={cx(`input__info text`,{active:(isRegPass===false)})}>
                * 8자 이상 16자 이하의 문자, 숫자 및 특수 문자를 조합하여 설정해주세요.
                </span>
              </div>
            </Grid>
          </Grid>

          <Grid container >
            <Grid item xs={3}>
              <label htmlFor="checkPassword" className="input__label">
                <span className="label__img_box">
                  <img src={icon_check} alt="icon_check"/>
                </span>
                <span>
                비밀번호확인
                </span>
              </label>  
            </Grid>
            <Grid item xs={8}>
            <OutlinedInput
                // error={errorPassword}
                id="checkPassword"
                type={isCheckPasswordShow ? 'text' : 'password'}
                value={checkPasswordVal}
                onChange={handleChange('checkPassword')}
                className={classes.input}
                autoComplete="off"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={()=>onClick({type:HANDLEEVENTTYPE.eyeIcon,stateKey:'checkPassword'})}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      className={classes.eyeIcon}
                    >
                      {iconPasswordVisible(`checkPassword`)}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={0}
              />
              <div className={cx(`input__info checkPassword`)}>
                <span className={cx(`input__info text`,{active:(isRegCheckPass===false)})}>
                * 비밀번호가 일치하지 않습니다.
                </span>
              </div>
            </Grid>
          </Grid>
          
          <Grid item xs={12} sm={12}>
            <div className="resetPass__btn_box">
              <Button
                variant="contained"
                color="primary"
                className={cx(classes.btn, 'signup bold')}
                name="user"
                onClick={onSubmit}>
                비밀번호 재설정
              </Button>
            </div>
          </Grid>

        </Grid>
      </form>
      <p className="signup__info login">이미 계정이 있으신가요?
        <span className="login__info"><Link to="/auth/signin">로그인하기</Link></span>
      </p>
    </Styled.ResetPasswordForm>
  );
}


const useStyles = makeStyles(theme => ({
  root:{
    '& input:valid:focus + fieldset': {
    borderColor: `${color.blue}`,
  },
    width:'100%'
  },
  
  textField: {
    width: '100%',
    marginBottom: 25,
  },
  btn: {
    display: 'inline-block',
    width: '100%',
    margin: 'auto',
    border: `1px solid ${color.blue}`,
    boxShadow:'none',
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
        boxShadow:'none',
        background: `${color.blue_hover}`
      },
    },
    '&.blue': {
      color:`white`,
      background: `${color.blue}`,
      '&:hover': {
        boxShadow:'none',
        background: `${color.blue_hover}`
      },
    },
  },
  formControl:{
    width:`100%`
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

const Styled ={
  ResetPasswordForm:styled.div`
    width:580px;
    .resetPass__info{
      margin-top:20px;
      ${font(12, color.gray_font)};
      &.login{
        text-align:center;
      }
    }
    .resetPass__title{
      ${font(27, color.black_font)};
      text-align:center;
      margin-bottom:100px;
    }
    .resetPass__btn_box{
      margin-bottom:12px;
      margin-top:30px;
      text-align:center;
    }
    .resetPass__input{
      &.public.text{
        ${font(12,color.gray_font)};
      }
    }
    .input__info{
      padding:5px 0;
      padding-bottom:10px;
      &.text{
        transition:.3s;
        opacity:0;
        ${font(12,color.blue_font)};
        color:${color.blue};
        &.active{
          opacity:1;
        }
      }
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
      ${font(14,color.black_font)};
      font-weight:bold;
    }
    .MuiSelect-outlined.MuiSelect-outlined{
      padding:10px ;
    }
    .signup__info{
      margin-top:20px;
      ${font(12, color.gray_font)};
      &.login{
        text-align:center;
      }
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

    .verifyTag{
      position: relative;
      .verify_count{
        position: absolute;
        right: 15px;
        top: 30%;
        transform: translateY(-50%);
        
        .timer{
          opacity: 0;
          font-size: 14px;
          color: #aaa;
          transition: opacity 0.3s linear;
          &.active{
            opacity: 1;
          }  
        }
      }

      .MuiOutlinedInput-input{
        padding-right: 54px;
      }
    }
      .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline{
        border-color: ${color.blue};
      }
    .MuiCheckbox-colorPrimary.Mui-checked{
      color:${color.blue}
    }
    .MuiOutlinedInput-root{
      border-radius: 3px;
    }
    .makeStyles-btn-3{
      border-radius: 3px;
    }
  `
}

export default ResetPasswordForm;