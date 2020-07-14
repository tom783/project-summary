import moment from "moment";
import { ENV_MODE_DEV } from "lib/setting";
import _ from "lodash";
import reactAttrconvert from "react-attr-converter";

/**
 * 정규식 비밀번호 유효성 검사
 * @param {string} value
 */
export function regPassword(value) {
  var regExp = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
  return regExp.test(value);
}

/**
 * 정규식 이메일 유효성 검사
 * @param {string} value
 */
export function regEmail(value) {
  var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return regExp.test(value);
}

/**
 * 정규식 이름 유효성 검사
 * @param {string} value
 */
export function regName(value) {
  var regExp = /^[\s0-9a-zㄱ-ㅎ가-힣_-]{0,100}$/i;
  return regExp.test(value);
}

/**
 * 정규식 글자 제한
 * @param {number} len
 * @param {string} value
 * @param {boolean} bool 마지막 boolean으로 1번째부터인지 0번째부터인지?
 */
export function regLength(len, value, bool) {
  try {
    value = value.toString().trim();
  } catch (e) {
    console.log(e, "error");
  }
  var regExp = bool
    ? new RegExp(`^.{${len},${len}}$`)
    : new RegExp(`^.{1,${len}}$`);
  return regExp.test(value);
}

/**
 * 로컬스토리지가 오브젝트인지 확인
 * @param {*}
 */
const st = typeof localStorage === "object" ? localStorage : {};

/**
 * 키값 관리 객체
 */
export const keys = {
  user: "__$$_dof_$$__",
  remember: `__$$_dof_$$__remember`,
  token: "__$$_dof_$$__token",
  autoLogin: "__$$_dof_$$__auto",
};

/**
 * 스토리지 맵핑 오브젝트
 */
export const storage = {
  set(key, value) {
    st[key] = JSON.stringify(value);
  },
  get(key) {
    if (!st[key]) return null;
    const value = st[key];
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch (e) {
      return value;
    }
  },
  remove(key) {
    delete st[key];
  },
  clear() {
    if (st.clear) {
      st.clear();
    }
  },
};

/**
 * 쿠키 관련 클래스
 */
class clsCookie {
  set(name, value, exp = 1) {
    // set(변수이름, 변수값, 기간(일수));
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie =
      name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
  }
  get(name) {
    // get(변수이름)
    var x, y;
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      x = cookies[i].substr(0, cookies[i].indexOf("="));
      y = cookies[i].substr(cookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, ""); // 앞과 뒤의 공백 제거하기
      if (x === name) {
        return unescape(y); // unescape로 디코딩 후 값 리턴
      }
    }
  }
  remove(name) {
    // deleteCookie(변수이름)
    document.cookie = name + "=; expires=Thu, 01 Jan 1999 00:00:10 GMT;";
  }
  clear() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
}
export const cookie = new clsCookie();

/**
 * 개발 환경 적용한 console.log
 * @param {string} param0 setPath // 현재 콘솔로그를 찍는 파일명
 * @param {string,object} (param0, param1) // 콘솔에 찍힐 txt와 payload 순서는 상관없이 사용가능.
 */
export const devConsoleSet = (setPath = "utils.js") => (txt, payload) => {
  if (ENV_MODE_DEV) {
    if (payload) {
      if (typeof payload === "string") {
        console.log(
          ` %c file: ${setPath} ${payload} :\n`,
          "color:skyblue;padding:5px;font-weight:bold",
          txt
        );
      } else {
        console.log(
          ` %c file: ${setPath} ${txt} :\n`,
          "color:skyblue;padding:5px;font-weight:bold",
          payload
        );
      }
    } else {
      if (typeof txt === "string") {
        console.log(
          ` %c file: ${setPath} ${txt} `,
          "color:skyblue;padding:5px;font-weight:bold"
        );
      } else {
        console.log(
          ` %c file: ${setPath} ${JSON.stringify(txt)} :\n`,
          "color:skyblue;padding:5px;font-weight:bold"
        );
      }
    }
  }
};

/**
 *
 * @param {*} target
 */
export function disableDragSelect(target) {
  try {
    if (target) {
      target.setAttribute("onselectstart", "return false");
      target.setAttribute("oncontextmenu", "return false");
      target.setAttribute("ondragstart", "return false");
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 *
 */
export const getScrollTop = () => {
  if (!document.body) return 0;
  const scrollTop = document.documentElement
    ? document.documentElement.scrollTop || document.body.scrollTop
    : document.body.scrollTop;
  return scrollTop;
};

/**
 *
 */
export const getScrollBottom = () => {
  if (!document.body) return 0;
  const { scrollHeight } = document.body;
  const { innerHeight } = window;
  const scrollTop = getScrollTop();
  return scrollHeight - innerHeight - scrollTop;
};

/**
 *
 */
export const preventStickBottom = () => {
  const scrollBottom = getScrollBottom();
  if (scrollBottom !== 0) return;
  if (document.documentElement) {
    document.documentElement.scrollTop -= 1;
  } else {
    if (!document.body) return;
    document.body.scrollTop -= 1;
  }
};

/**
 *
 * @param {*} start
 * @param {*} end
 */
export function numRangeMap(start, end) {
  return function (num) {
    return num >= start && num <= end;
  };
}

/**
 * isFocusCurrentTarget
 * @param {*} param0 e, eventObject
 */
export function isFocusCurrentTarget({ relatedTarget, currentTarget }) {
  if (relatedTarget === null) return false;
  let node = relatedTarget.parentNode;
  while (node !== null) {
    if (node === currentTarget) return true;
    node = node.parentNode;
  }
  return false;
}

/**
 * 정한 숫자만큼 앞에 0이 붙는다
 * ex) fixedNumbering(50,4) => 0050
 * @param {*} number
 * @param {*} len
 * 길이를 정해줄 수 있다.
 */
export function fixedNumbering(number, len = 4) {
  const str = "" + number;
  const pad = "0".repeat(len);
  const ans = pad.substring(0, pad.length - str.length) + str;
  return ans;
}

/**
 *
 * @param {*} text
 */
export function AlertFn(text) {
  console.log(`
  ==========================
  >>> *${text}
  ==========================
  `);
  return;
}

/**
 *
 * @param {*} val
 */
export function checkValueDash(val) {
  return val ? val : "-";
}

/**
 *
 * @param {*} config
 */
export function convertDateTime(config) {
  const { type = "date", format = "YYYY-MM-DD", value = 0, isNull } = config;
  if (isNull && !value) {
    return isNull;
  }
  if (type === "unix") {
    return moment(value).valueOf();
  } else if (type === "date") {
    return moment.unix(value).format(format);
  }
}

/**
 *
 * @param {*} target
 */
export function getElementSize(target) {
  if (target) {
    const { clientWidth, clientHeight } = target;
    return { x: clientWidth, y: clientHeight };
  }
  return { x: null, y: null };
}

/**
 //files을 배열로 file들을 넣어야함
  uploadFile은 서버에서 받으려는 파일 네임.
 * const testData = {
    caseCode, 
    caseId, 
    userCode, 
    files:{
      uploadFile:files
    }
  }
  const formData = setFormData(testData);
  INFO_WORKS_DIRECT_FILE_UPLOAD_SAGAS(formData);
 * @param {*} data 
 */
export function setFormData(data) {
  const formData = new FormData();
  _.forOwn(data, (val, key, value) => {
    formData.append(key, val);
    if (key === "files") {
      _.forOwn(val, (in_val, in_key) => {
        if (Array.isArray(in_val)) {
          in_val.forEach((item) => formData.append(in_key, item));
        }
      });
    }
  });
  return formData;
}

/**
 * 확장자있는 파일네임 추출
 * @param {*} name
 */
export function extractFileName(name) {
  const index = name.lastIndexOf(".");
  let fileName = name;
  if (index != -1) {
    fileName = name.substring(0, index);
  }
  return fileName;
}

/**
 * 파일명에서 확장자명 추출
 * @param filename   파일명
 * @returns _fileExt 확장자명
 */
export function getExtensionOfFilename(filename) {
  const _fileLen = filename.length;
  const _lastDot = filename.lastIndexOf(".");
  const _fileExt = filename.substring(_lastDot, _fileLen).toLowerCase();
  return _fileExt;
}

/**
 *
 * @param {*} e
 */
export function disableF5(e) {
  const keycode = e.keyCode;
  if (
    (e.ctrlKey == true && (keycode == 78 || keycode == 82)) ||
    (e.which || keycode) == 116
  ) {
    e.preventDefault();
  }
}

/**
 *
 * @param {*} nextProp
 * @param {*} prevProp
 * @param {*} list
 */
export function compareProp(nextProp, prevProp, list) {
  const compareBoolList = list.map((item) => prevProp[item] === nextProp[item]);
  return compareBoolList.every((item) => item === true);
}

/**
 * 카멜케이스를 대쉬로 바꿔주는 정규식 함수
 * @param {*} str
 */
export const camelCaseToDash = (str) =>
  str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * * 대쉬로 이뤄진 문자를 카멜케이스로 바꿔주는 정규식 함수
 * @param {*} str
 */
export const dashToCamelCase = (str) =>
  str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });

/**
 * 스트링으로짜여있는 css를 jsx 객체형식으로 바꿔주는 함수
 * @param {string} str
 */
export const stringCssToObject = (str) => {
  var result = {},
    attributes = str.split(";");
  for (var i = 0; i < attributes.length; i++) {
    var entry = attributes[i].split(":");
    const keyName = entry.splice(0, 1)[0].trim();
    if (keyName !== "") {
      result[keyName] = entry.join(":");
    }
  }
  return result;
};

/**
 * 로그함수
 * @param {*} value
 */
// NOTE: 로그레벨에 대한 정의 필요
const logLevel = 0;
export const log = (...value) => {
  if (logLevel === 0) {
    console.log(...value);
  } else if (logLevel === 1) {
    return null;
  }
};

// NOTE: not used
// export function rmmbrace(value){
//   // var regExp = /[\{\}']+/g;
//   return value.replace(/[\{\}']+/g,'')
// }

/**
 * NOTE: 케이스 아이디를 만들어주는 포맷 함수
 * @param {object} config
 */
export const makeCaseID = (config) => {
  const { date = "", company = "", patient = "", numbering = "" } = config;
  return `${date}${company}${patient}${numbering}`;
};

/**
 * NOTE: 특정 문자를 카멜케이스로 치환해서 반환해줍니다.
 * @param {*} config
 */
export function replaceCamelCase(config) {
  const { str, replace = "-" } = config;
  const regConvert = new RegExp(`/${replace}([a-z])/g`);
  return str.replace(/[:-]([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

/**
 * NOTE: 리얼돔 엘리먼트의 구조를 오브젝트 구초제로 변환해주는 함수입니다.
 * @param {object} item element node
 */
export function getElementAttrToObject(item) {
  const text = item.text;
  const new_obj = Array.from(item.attributes).reduce((x, y) => {
    const replaceStr = reactAttrconvert(y.name);
    x[replaceStr] = y.value;
    if (text && text.trim().length > 0) x.text = text;
    return x;
  }, {});
  new_obj.element = item.nodeName;
  if (item.nodeName === "text") {
    new_obj.text = item.textContent;
  }
  if (item.children.length > 0) {
    new_obj.children = Array.from(item.children, getElementAttrToObject);
  }
  return new_obj;
}

/**
 * 첫번째 인자를 기준으로 두번재 인자로 들어온 속성을 가진 부모를 재귀적으로 부모엘리먼트를 찾아 올라가는 함수입니다.
 * @param {*} elm
 * @param {*} attributes
 */
/**
 * //FIXME: class2개일때 1개만 만족해도 처리하는 기능 추가.
 * findParent(ccc, {title:'hello',class:'abc'})
 * 첫번째인자로 타겟을 찍고 두번째인자로 찾을 요소가 포함되어있는지 쓰면 된다. 그럼 재귀로 부모를 쭉 타고 올라가서 모두 만족하면 해당 부모 elm을 아니면 null을 반환한다
 */

export function findParent(elm, attributes) {
  const resArr = [],
    tmp = elm;
  if (attributes && typeof attributes !== "string") {
    for (var attr in attributes) {
      elm = tmp;
      if (attributes.hasOwnProperty(attr)) {
        if (elm.getAttribute(attr) === attributes[attr]) {
          resArr.push(elm);
        } else {
          while ((elm = elm.parentElement)) {
            const getClass = elm.getAttribute(attr);
            const classListArr = getClass ? getClass.split(" ") : null;
            if (classListArr && classListArr.length >= 2) {
              if (inMap(classListArr, attributes[attr])) break;
            } else {
              if (elm.getAttribute(attr) === attributes[attr]) {
                resArr.push(elm);
                break;
              }
            }
          }
        }
      }
    }
  } else {
    if (typeof attributes === "string") {
      if (elm.getAttribute(attributes)) {
        resArr.push(elm);
      } else {
        while ((elm = elm.parentElement)) {
          if (elm.getAttribute(attributes)) {
            resArr.push(elm);
            break;
          }
        }
      }
    }
  }

  function inMap(arr, attr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === attr) {
        resArr.push(elm);
        return true;
      }
    }
    return false;
  }
  if (typeof attributes === "string") return resArr[0];
  return resArr.every((x) => x === resArr[0]) &&
    resArr.length === Object.keys(attributes).length
    ? resArr[0]
    : null;
}

/**
 * NOTE: 오브젝트의 키들을 카멜케이스로 바꿔줍니다.
 */
export function convertObjectKeyToCamelCase(o) {
  let newO, origKey, newKey, value;
  if (o instanceof Array) {
    return o.map(function (value) {
      if (typeof value === "object") {
        value = convertObjectKeyToCamelCase(value);
      }
      return value;
    });
  } else {
    newO = {};
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (
          origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
        ).toString();
        value = o[origKey];
        if (
          value instanceof Array ||
          (value !== null && value.constructor === Object)
        ) {
          value = convertObjectKeyToCamelCase(value);
        }
        newO[newKey] = value;
      }
    }
  }
  return newO;
}

/**
 * NOTE: 스트링 "true"나 true 로 들어온 값을 불리언으로 변환해 비교해줍니다.
 * @param {boolean, string} string
 */
export function stringBoolean(string) {
  let value = null;
  if (typeof string === "string") {
    value = string.toLowerCase().trim();
  } else {
    value = string;
  }
  switch (value) {
    case "true":
    case "yes":
    case "1":
      return true;
    case "false":
    case "no":
    case "0":
    case null:
      return false;
    default:
      return Boolean(string);
  }
}

/**
 * NOTE: target object에 ref.current를 넣으면 해당 스크롤을 바닥으로 유직할 수 있습니다.
 * @param {*} target
 */
export function scrollToBottom(target) {
  const scrollHeight = target.scrollHeight;
  const height = target.clientHeight;
  const maxScrollTop = scrollHeight - height;
  target.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
}

/**
 * 함수 2개를 merge해주는데 두번째인자에 있는 배열의 개수들로 overwrite해준다
 * overwriteArrayToArray(selectedOverwriteList,multiSelectedList,['number']);
 * @param {*} arr1
 * @param {*} arr2
 * @param {*} condi
 */
export function mergeArray(arr1, arr2, condi) {
  let newCloneList = _.cloneDeep(arr1);
  _.forEach(arr2, (item) => {
    const findObj = _.find(
      newCloneList,
      (in_item) => +in_item[condi] === item[condi]
    );
    if (findObj) {
      newCloneList = _.filter(
        newCloneList,
        (d_item) => +d_item[condi] !== +findObj[condi]
      ).concat(item);
    } else {
      newCloneList.push(item);
    }
  });
  return newCloneList;
}
