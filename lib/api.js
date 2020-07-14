import { setFormData } from "lib/library";
import _ from "lodash";
import axios from "axios";
import { Actions } from "store/actionCreators";
import {
  lfw_address,
  lfw_bin_address,
  test_server_address,
  ENV_MODE_DEV,
} from "lib/setting";

let testIp = test_server_address;
let ip = lfw_address;
let localIp = `http://localhost:13986`;
let binIp = lfw_bin_address;

const endPoint = {};

/**
 *
 * @param {*} axiosConf object
 * 통신할때 필요한 axios의 config 값을 넣어줍니다.
 * @param {*} config object
 * {header:false} 라고 할 시 header 체크를 하지 않습니다.
 */
/**
  * 
    "result": 1,
    "headers": {
        "loginUserCode": "",
        "x-access-token": null
    }
      "result": 1,
    "headers": {
        "loginUserCode": "",
        "x-access-token": null
    }
  */
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

function Acx(axiosConf, config = {}) {
  const defaultConfig = { header: true };
  const mergeConfig = _.merge(defaultConfig, config);
  const hasData = axiosConf.data;
  axiosConf.cancelToken = source.token;
  if (hasData) {
    axiosConf.data.url = axiosConf.url;
  }
  if (mergeConfig && mergeConfig.header) {
    axiosConf.timeout = 10000;
    return axios(axiosConf)
      .catch((err) => ({ error: err }))
      .then((res) => {
        const { data, error } = res;
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
          return { cancel: true };
        }
        try {
          if (data.headers) {
            // DEBUG: 해더쪽 상의 필요
            // if(!error && data && data.headers && data.headers.onlineState != null){
            // Actions.base_profile_info_update({value:data.headers.onlineState});
            Actions.base_network_connect({ value: data.headers.onlineState });
            Actions.base_message_get({ value: data.headers.notReadMessage });
          }
        } catch (err) {
          // 오류 처리
          console.log(err, "error");
          console.error("Response Data is undefined");
          const errorConf = {
            // url:"http://localhost:9999/errortest",
            url: endPoint.post_error_meesage,
            method: "post",
            data: {
              url: axiosConf.url,
              payload: axiosConf,
              statusCode: err.statusCode,
              message: err.message,
              stack: err.stack,
            },
          };
          axios(errorConf).catch((err) => ({ error: err }));
        }
        return res;
      });
  } else {
    return axios(axiosConf).catch((err) => ({ error: err }));
  }
}

export function axiosCancel() {
  source.cancel("Operation canceled");
}

/**
 *
 * @param {*} payload object
 */
export function postSignin(payload) {
  console.log(endPoint.post_signin, "endPoint.post_signin");
  const axiosConf = {
    url: endPoint.post_signin,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 */
export function postLogout() {
  console.log(`api : post_logout`);
  const axiosConf = {
    url: endPoint.post_logout,
    method: "post",
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload object
 */
// DEBUG: 해야함

export function postToken(payload) {
  const axiosConf = {
    url: ENV_MODE_DEV
      ? `${testIp}/auth/launcher/api/user/refresh/token`
      : endPoint.post_token,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload obejct
 */
/**
   * res: { // localhost
     fail : 0,
     success: 1, 
     notFound : 2,
     notEnoughParam : 3,
     noAffected: 4,
     err: 5,
     notEnoughPoint : 6
   },
   emailResult : {
     notAuth: 0, // 아무것도 안됬을때,
     success : 1, // 성공
     aleadyExist : 2,// 중복
     sendFail : 3, // 이메일 보내는거 실패
     notMatched : 4, // 인증 코드가 틀렸을때
     expired : 5 // 인증시간 오류
   },
   */
export function postSignUp(payload) {
  const axiosConf = {
    url: endPoint.post_signup,
    method: "post",
    data: {
      ...payload,
      company_name: payload.company,
      states_id: payload.location,
    },
  };
  return Acx(axiosConf);
}
/**
 *
 * @param {*} payload object
 */
export function postGetMyInfo(payload) {
  const axiosConf = {
    url: endPoint.post_mypage_info,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload object
 */
export function postUpdateMyInfo(payload) {
  const axiosConf = {
    url: endPoint.post_mypage_update_info,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload object
 */
export function postGetPartnerInfo(payload) {
  const axiosConf = {
    url: endPoint.post_mypage_partner,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 인디케이션 포맷 정보를 가져오는 함수
 */
export function postGetIndicationFormat(payload) {
  const axiosConf = {
    url: endPoint.post_base_get_indication_format,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

export function postGetIndicationAdd(payload) {
  const axiosConf = {
    url: endPoint.post_base_indication_add,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 회원가입 인증코드 확인 요청
 */
export function postVerifyCode(payload) {
  const axiosConf = {
    url: endPoint.post_signup_verify_code,
    method: "post",
    data: {
      email: payload.email,
      random: payload.verifyCode,
    },
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload object
 * 패스워드 변경 요청
 */
export function postResetPassword(payload) {
  const axiosConf = {
    url: endPoint.post_reset_password,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload object
 * 패스워드 변경 요청(로그인 후)
 */
export function postChangePassword(payload) {
  const axiosConf = {
    url: endPoint.post_change_password,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 인증코드 이메일 전송 요청
 */
export function postVerifyEmail(payload) {
  const axiosConf = {
    url: endPoint.post_verify_email,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 비밀번호 변경 인증코드 이메일 전송 요청
 */
export function postResetVerifyEmail(payload) {
  const axiosConf = {
    url: endPoint.post_reset_verify_email,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 */
export function postGetCountryList(payload) {
  const axiosConf = {
    url: endPoint.post_listing_country,
    method: "get",
    // data:payload
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 */
export function postGetLocationList(payload) {
  console.log(`>>>postGetLocationList`);
  console.log(payload);
  const axiosConf = {
    url: endPoint.post_listing_location(payload.value),
    method: "get",
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 */
export function postGetCaseList(payload) {
  console.log(`>>>postGetCaseList`);
  const axiosConf = {
    url: endPoint.post_listing_case_load,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 */
export function postCreateCase(payload) {
  const axiosConf = {
    url: endPoint.post_info_case_create,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 케이스 리스트 갯수
 */
export function postGetCaseListCount(payload) {
  const axiosConf = {
    url: endPoint.post_info_case_list_count,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 파트너 리스트 정보
 */
export function postGetPartnersList(payload) {
  const axiosConf = {
    url: endPoint.post_listing_partners_list,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 내 파트너 리스트 변경
 */
export function postGetMyPartnersListAdd(payload) {
  const axiosConf = {
    url: endPoint.post_listing_my_partner_add,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 내 파트너 리스트 변경
 */
export function postGetMyPartnersListDefaultAdd(payload) {
  const axiosConf = {
    url: endPoint.post_listing_my_partner_default_add,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 내 파트너 삭제 요청
 * @param {*} payload
 */
export function postGetMyPartnersListDelete(payload) {
  const axiosConf = {
    url: endPoint.post_listing_my_partner_delete,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 내 파트너 리스트 모달 데이터
 */
export function postGetMyPartnersListModal(payload) {
  const axiosConf = {
    url: endPoint.post_listing_my_partner_modal,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 파트너 리스트 정보 검색
 */
export function postGetPartnersSearchList(payload) {
  const axiosConf = {
    url: endPoint.post_listing_partners_search_list,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 파트너 리스트 정보 검색
 */
export function postGetMyPartnersList(payload) {
  const axiosConf = {
    url: endPoint.post_listing_my_partners_list,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 파트너 타입 리스트
 */
export function postGetPartnersTypeList(payload) {
  const axiosConf = {
    url: endPoint.post_listing_partners_type_list,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 파트너 옵션 변경
 */
export function postUpdateOption(payload) {
  const axiosConf = {
    url: endPoint.post_update_option,
    method: "post",
    data: payload,
  };
  return Acx(axiosConf);
}

/**
 * 케이스 정보를 로드합니다.
 * @param {*} payload
 */
export function postGetCaseLoad(payload) {
  console.log(">>> postGetCaseLoad");

  // const testurl = 'http://localhost:9999/bin/info/delete'
  const axiosConf = {
    url: endPoint.post_info_case_load,
    // url: testurl,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
  // return axios(axiosConf).catch(err=>({error:err}));
}

/**
 * 케이스를 삭제합니다.
 * @param {*} payload
 */
export function postDeleteCase(payload) {
  console.log(">>> postDeleteCase");

  const testUrl = "http://localhost:9999/bin/info/delete";
  const axiosConf = {
    // url:testUrl,
    url: endPoint.post_info_case_delete,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 케이스 정보를 업데이트합니다.
 * @param {*} payload
 */
export function postCaseUpdate(payload) {
  console.log(">>> postCaseUpdate");
  // NOTE: sender일때는 create/new
  // NOTE: reciever 일때는 works/update

  let axiosConf = {};
  if (payload.type === 1) {
    console.log("receiver");
    axiosConf = {
      url: `${ip}/launcher/api/works/update`,
      method: "post",
      data: {
        userCode: payload.userCode,
        caseCode: payload.caseCode,
        memo: payload.receiverMemo,
        completeFlag: false,
        type: payload.type,
      },
    };
  } else if (payload.type === 0) {
    console.log("sender");
    axiosConf = {
      url: `${ip}/launcher/api/case/create/new`,
      method: "post",
      data: payload,
    };
  }
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * works의 케이스 정보를 업데이트합니다.
 * @param {*} payload
 */
export function postWorksCaseUpdate(payload) {
  console.log(">>> postWorksCaseUpdate");
  let axiosConf = {};

  const apiUrl = ENV_MODE_DEV
    ? "http://localhost:9999/bin/file/data/test"
    : `${ip}/launcher/api/works/update`;
  if (payload.type === 1) {
    // Receiver
    axiosConf = {
      url: `${ip}/launcher/api/works/update`,
      method: "post",
      data: {
        userCode: payload.userCode,
        caseCode: payload.caseCode,
        memo: payload.memo,
        completeFlag: false,
        type: payload.type,
      },
    };
  } else if (payload.type === 0) {
    // Sender
    axiosConf = {
      url: `${ip}/launcher/api/works/update`,
      // url:apiUrl,
      method: "post",
      data: {
        userCode: payload.userCode,
        caseCode: payload.caseCode,
        memo: payload.memo,
        completeFlag: false,
        type: payload.type,
      },
    };
  }
  console.log(axiosConf, "axiosConf");
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 케이스 컴플리트
 * @param {*} payload
 */
export function postCaseComplete(payload) {
  const axiosConf = {
    url: `${ip}/launcher/api/works/complete`,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * Works 카드 하이드
 * @param {*} payload
 */
export function postWorksCardHide(payload) {
  const axiosConf = {
    url: endPoint.post_info_works_hide,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 크리에이트 케이스 인잇 데이터
 */
export function postGetCaseInit(payload) {
  const axiosConf = {
    url: endPoint.post_info_case_init_data,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 웍스 서치 리스트
 * @param {*} payload
 */
export function postGetWorksSearchList(payload) {
  // post_listing_work_search_list
  const formatConfig = {
    userCode: payload.userCode || "",
    page: payload.page || 1,
    sort: payload.sort || 1,
    search: payload.search || "",
    type: payload.type || "",
    first: payload.first || true,
    filter: {
      stage: (payload.filter && payload.filter.stage) || [],
      type: (payload.filter && payload.filter.type) || [],
      hidden: (payload.filter && payload.filter.hidden) || 0,
    },
  };

  const axiosConf = {
    url: `${ip}/launcher/api/works/list`,
    method: "post",
    data: formatConfig,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 웍스 리스트
 * @param {*} payload
 */
export function postGetWorksGetList(payload) {
  // post_listing_work_search_list
  const formatConfig = {
    userCode: payload.userCode || "",
    page: payload.page || 1,
    sort: payload.sort || 1,
    search: payload.search || "",
    type: payload.type || "",
    first: payload.first || true,
    filter: {
      stage: [],
      type: [],
      hidden: 0,
    },
  };

  const axiosConf = {
    url: `${ip}/launcher/api/works/list`,
    method: "post",
    data: formatConfig,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 알림 리스트
 * @param {*} payload
 */
export function postGetMessageList(payload) {
  const axiosConf = {
    url: endPoint.post_message_list,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**

 * works 디테일 통신
 * @param {*} payload 
 */
export function postGetWorksDetail(payload) {
  console.log(`>>>postGetWorksDetail`);
  console.log(payload);
  // post_listing_work_search_list
  const axiosConf = {
    url: `${ip}/launcher/api/works/detail`,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * works 패널 리드 통신
 * @param {*} payload
 */
export function postCheckWorksRead(payload) {
  console.log(`>>>postWorksRead`);
  console.log(payload);
  // post_listing_work_search_list
  const axiosConf = {
    url: `${ip}/launcher/api/works/read`,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * works 패널 리드 통신
 * @param {*} payload
 */
export function postCheckWorksFileDownload(payload) {
  console.log(`>>>postWorksDownload`);
  console.log(payload);
  // post_listing_work_search_list
  const apiUrl = ENV_MODE_DEV
    ? "http://localhost:9999/bin/file/data/test"
    : `${ip}/launcher/api/works/download`;
  const axiosConf = {
    url: `${ip}/launcher/api/works/download`,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * works 다이렉트 파일 업로드
 * @param {*} payload
 */
export function postWorksDirectFileUpload(payload) {
  console.log(`>>>postWorksDirectFileUpload`);
  console.log(payload);
  const apiurl = ENV_MODE_DEV
    ? `http://localhost:9999/bin/file/data/test`
    : `${binIp}/launcher/bin/file/direct/upload`;
  const axiosConf = {
    url: `${binIp}/launcher/bin/file/direct/upload`,
    method: "post",
    data: payload,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  console.log(axiosConf, "axiosConf!!!!");
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * works 다이렉트 파일 업로드
 * @param {*} payload
 */
export function postWorksDirectFileDownload(payload) {
  console.log(`>>>postWorksDirectFileDownload`);
  console.log(payload);
  // post_listing_work_search_list
  // /bin/file/data
  // DEBUG: 테스트서버임. 그냥 a링크로 다운중
  const apiurl = ENV_MODE_DEV
    ? `http://localhost:9999/bin/direct/download`
    : `${binIp}/launcher/bin/file/direct/upload`;
  const axiosConf = {
    url: apiurl,
    method: "post",
    data: payload,
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 워크 디테일 Direct 파일 삭제
 * @param {*} payload
 */
export function postWorksDirectFileDelete(payload) {
  console.log(`>>>postWorksDirectFileDelete`);
  console.log(payload);
  // post_listing_work_search_list
  // /bin/file/data

  const apiurl = ENV_MODE_DEV
    ? `http://localhost:9999/bin/file/data/test`
    : `${binIp}/launcher/bin/file/direct/upload`;
  const axiosConf = {
    url: `${binIp}/launcher/bin/file/delete`,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * works 앱 동기화 업로드
 * @param {*} payload
 */
export function postAppDataUpload(payload) {
  console.log(`>>>postAppDataUpload`);
  console.log(payload);
  // post_listing_work_search_list

  const apiurl = ENV_MODE_DEV
    ? `http://localhost:9999/bin/app/upload`
    : `${ip}/launcher/bin/file/case/upload`;
  const axiosConf = {
    url: apiurl,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * works 앱 동기화 다운로드
 * @param {*} payload
 */
export function postAppDataDownload(payload) {
  console.log(`>>>postAppDataDownload`);
  console.log(payload);
  // post_listing_work_search_list
  const apiurl = ENV_MODE_DEV
    ? `http://localhost:9999/bin/app/download`
    : `${ip}/launcher/bin/app/upload`;
  const axiosConf = {
    url: apiurl,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 알림 리스트 삭제
 * @param {*} payload
 */
export function postDeleteMessageList(payload) {
  const axiosConf = {
    url: endPoint.post_message_delete,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 알림 리스트 전체 삭제
 * @param {*} payload
 */
export function postDeleteMessageListAll(payload) {
  const axiosConf = {
    url: endPoint.post_message_delete_all,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 알림 요청 수용 여부 업데이트
 * @param {*} payload
 */
export function postMessageUpdate(payload) {
  const axiosConf = {
    url: endPoint.post_message_update,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 알림 읽기
 * @param {*} payload
 */
export function postMessageRead(payload) {
  const axiosConf = {
    url: endPoint.post_message_read,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 *
 * @param {*} payload
 * 실행 네비게이션
 */

export function postExeNavSubmit(payload) {
  const axiosConf = {
    url: ENV_MODE_DEV ? `${testIp}/exeapp` : endPoint.post_exe_nav_submit,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 작업 경로 정보
 * @param {*} payload
 */
export function postWorkspaceGet(payload) {
  console.log(`>>>postWorkspaceGet`);
  console.log(payload);

  const axiosConf = {
    url: ENV_MODE_DEV
      ? `${testIp}/users/launcher/my/workspace`
      : endPoint.post_workSpace_get,
    method: "post",
    data: payload,
  };
  // setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 작업 경로 설정
 * @param {*} payload
 */
export function postWorkspaceSet(payload) {
  console.log(`>>>postWorkspaceSet`);
  console.log(payload);

  const axiosConf = {
    url: ENV_MODE_DEV
      ? `${testIp}/users/launcher/my/workspace/change`
      : endPoint.post_workSpace_set,
    method: "post",
    data: payload,
  };
  // setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 프로필 이미지 변경
 * @param {*} payload
 */
export function postChangeProfile(payload) {
  let customData = {
    userCode: payload.userCode,
    profileFile: payload.file,
  };
  const formData = setFormData(customData);

  const axiosConf = {
    url: endPoint.post_change_profile,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * exe 바로가기 파일 업로드
 * @param {*} payload
 */
export function postUploadShortCutExe(payload) {
  console.log(`>>>postUploadShortCutExe`);
  console.log(payload);

  const axiosConf = {
    url: endPoint.post_upload_shortcut_exe,
    method: "post",
    data: {
      userCode: payload.userCode,
      applicationFile: payload.file,
      applicationType: payload.applicationType,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  // setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * auto login
 * @param {*} payload
 */
export function postAutoLogin(payload) {
  console.log(`>>>postAutoLogin`);
  console.log(payload);

  const axiosConf = {
    url: ENV_MODE_DEV
      ? `${testIp}/auth/launcher/api/user/autologin`
      : endPoint.post_auto_login,
    method: "post",
    data: payload,
  };
  // setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * paging test
 * @param {*} payload
 */
// DEBUG: 여기 페이징해보기
export function postTestPageList(payload) {
  console.log(`>>>postTestPageList`);
  const page = payload;
  const limit = (count, page) =>
    `limit=${count}&offset=${page ? page * count : 0}`;

  const axiosConf = {
    url: `${ip}/launcher/api/works/list`,
    method: "post",

    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * 동기화 요청
 * @param {*} payload
 */
export function postCaseSync(payload) {
  console.log(`>>>postCaseSync`);

  const axiosConf = {
    url: endPoint.post_case_sync,
    method: "post",
    data: payload,
  };
  setHeader(axiosConf);
  return Acx(axiosConf);
}

/**
 * Test
 * @param {*} payload
 */
export function getTest(payload) {
  if (!payload) {
    payload = 1;
  }
  const axiosConf = {
    url: `https://jsonplaceholder.typicode.com/todos/${payload}`,
  };
  return Acx(axiosConf);
}

/**
 * Test Server Set Header
 * @param {} axiosConf
 */
function setHeader(axiosConf) {
  // NOTE: receiver : 20Jan31-0001
  // NOTE: sender : 20Feb12-0002
  let headerObj;
  if (ENV_MODE_DEV) {
    headerObj = {
      headers: {
        "x-access-token": "token",
        loginUserCode: "code",
      },
    };
  }
  Object.assign(axiosConf.data, headerObj);
  return axiosConf;
}
