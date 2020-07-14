
import React, {
  useEffect,
  useRef,
  useReducer,
  useState,
  useCallback
} from 'react';
import _ from 'lodash';
import { call } from 'redux-saga/effects';
import { AlertFn } from 'lib/library';
import { dispatch } from 'store/actionCreators';

// SECTION: Redux Saga, Actions

/**
 * Actions Name
 * @param {*} actionName string
 */
export function makeAsyncActions(actionName) {
  const prefix = actionName;
  const prefixObj = {
    INDEX: 'INDEX',
    INIT: `INIT`,
    REQUEST: `REQUEST`,
    PENDING: `PENDING`,
    SUCCESS: `SUCCESS`,
    FAILURE: `FAILURE`,
    CANCEL: `CANCEL`,
  }
  for (const item in prefixObj) {
    prefixObj[item] = prefix + `_${item}`;
  }
  prefixObj.init = (payload) => makeActionCreator(prefixObj.INIT, payload);
  return prefixObj;
}

/**
 * makeActionCreator
 * @param {*} actionType 
 * @param {*} payload 
 */
export function makeActionCreator(actionType, payload) {
  return dispatch({ type: actionType, payload: payload })
}

/**
 * makeAsyncActions
 * @param {*} actions Object
 */
export function makeAsyncCreateActions(actions) {
  const ActionsFunction = (payload) => makeActionCreator(actions.INDEX, payload);
  return (api) => {
    if (typeof api !== 'function') new Error('api must be Function');
    ActionsFunction.index = actions.INDEX;
    ActionsFunction.request = (data) => api(data);
    ActionsFunction.init = (payload) => makeActionCreator(actions.INIT, payload);
    ActionsFunction.pending = (payload) => makeActionCreator(actions.PENDING, payload);
    ActionsFunction.success = (payload) => makeActionCreator(actions.SUCCESS, payload);
    ActionsFunction.failure = (payload) => makeActionCreator(actions.FAILURE, payload);
    return ActionsFunction
  }
}

/**
 * 
 * @param {*} type 
 * @param {*} promiseCreator 
 */
export const createPromiseSaga = ({
  type,
  tag,
  pending = () => { },
  success = () => { },
  failure = () => { }
}) => {
  return function* saga(action) {
    AlertFn(tag);
    if (!type) {
      console.warn(`createPromiseSaga Need type`);
      return null;
    };
    try {
      const payload = action.payload;
      console.log(`${type.index} PENDING`);
      pending(action);
      type.pending();
      console.log(` %cRequest Data :\n`, "color:red;padding:5px;font-weight:bold", payload);
      const { data, error, cancel } = yield call(type.request, payload);
      console.log(` %cResponse Data :\n`, "color:red;padding:5px;font-weight:bold", data);

      if (cancel) {
        type.pending({ type: "cancel" });
        return;
      }
      // console.log(data,'data!!!!!');
      data.payload = payload || {};
      if (data && !error) {
        if (data.result === 1) {
          console.log(`${type.index} SUCCESS`);
          success(data, payload);
          type.success(data);
        } else {
          console.log(`${type.index} FAILURE`);
          failure(data);
          type.failure(data);
        }
      } else {
        console.log(`${type.index} FAILURE`);
        failure(data);
        type.failure(data);
      }
    } catch (e) {
      console.log(`${type.index} ERROR`);
      console.log(e, 'error');
    }
  };
};

/**
 * 
 * @param {*} draft 
 * @param {*} type 
 */
export function IPSFset(draft, type) {
  draft.pending = false;
  draft.success = false;
  draft.failure = false;
  if (type !== 'init') {
    draft[type] = true;
  }
}

// SECTION: use
/**
 * usePromise
 * @param {*} promiseCreator Promise Object
 * @param {*} deps array
 */
// export function usePromise(promiseCreator, deps) {
//   const [resolved, setResolved] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const processor = async () => {
//     setLoading(true);
//     try {
//       const result = await promiseCreator();
//       setResolved(result);
//     } catch (e) {
//       setError(e);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     processor();
//   }, [deps,processor]);

//   return [loading, resolved, error];
// }


/**
 * useInput
 * @param {*} initialForm object
 */
export const useInput = (function () {
  function reducer(state, action) {
    return { ...state, [action.name]: action.value }
  }

  return function useInput(initialForm) {
    const [state, dispatch] = useReducer(reducer, initialForm);

    const onChange = e => {
      dispatch(e.target);
    }
    return [state, onChange];
  }
})();

/**
 * DidUpdateMount를 구현한 Custom hooks
 * @param {*} fn 
 * @param {*} inputs 
 */
export function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      fn();
    }
    else {
      didMountRef.current = true;
    }
  }, inputs);
}


/**
 * NOTE: 랜더링 부분에서 사용하면 됨
 * const prevState = usePrevious(values);
 * @param {*} value 
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  },[value]);
  return ref.current;
}

/**
 * NOTE: 강제로 렌더링을 진행할때 사용합니다.
 */
export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, [])
  return update;
}

/**
 * 
 * @param {*} f 
 */
export const useDidMount = f => useEffect(() => f && f(), []);

/**
 * 
 * @param {*} value 
 * @param {*} delay 
 */
export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );

  return debouncedValue;
}

export const useActiveElement = () => {
  const [active, setActive] = React.useState(document.activeElement);
  const handleFocusIn = (e) => {
    setActive(document.activeElement);
  }
  React.useEffect(() => {
    document.addEventListener('focusin', handleFocusIn)
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
    };
  }, [])
  return active;
}

/**
 * current 이벤트 바인딩시 이벤트 컨택스트가 달라질때 사용.
 * @param {*} callback 
 */
export function useSharedCallbackUnsafe(callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return (...args) => callbackRef.current(...args);
}

//SECTION: Hign Order Component (HOC)
/**
 * 
 * @param {*} url 
 */
export const withLoading = (WrappedComponent) => (props) => {
  return props.isLoading
    ? (console.log('Base landing...'), <div>Loading ...</div>)
    : <WrappedComponent {...props} />
}

export const withUseEffect = (fn, arr) => {
  // arr.forEach((item)=>{
  //   useEffect(()=>{
  //   },[item]);
  // });
}


/**
 * NOTE: keyPress를 위한 훅스
 * @param {*} targetKey 
 */
export function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = _.debounce(({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }, 100)

  // If released key is our target key then set to false

  const upHandler = _.debounce(({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  }, 100);

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}



export function useMultiKeyPress(keyCombine=[]) {
  const [keysPressed, setKeyPressed] = useState(new Set([]));

  const downHandler =({ key }) =>{
    setKeyPressed(keysPressed.add(key));
  }

  const upHandler = ({ key }) => {
    keysPressed.delete(key);
    setKeyPressed(keysPressed);
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keysPressed;
}

//SECTION: Reducer 
/**
 * 
 * @param {*} reducerInitalize 
 */
export function initReducer(typeAction) {
  dispatch(typeAction)
}





export const useDoubleClick = ({
  ref,
  latency = 300,
  onClick = () => null,
  onDoubleClick = () => null
}) => {
  useEffect(() => {
    const clickRef = ref.current;
    let clickCount = 0;
    const handleClick = e => {
      clickCount += 1;
      setTimeout(() => {
        if (clickCount === 1) onClick(e);
        else if (clickCount === 2) onDoubleClick(e);

        clickCount = 0;
      }, latency);
    };
    clickRef.addEventListener('click', handleClick);
    return () => {
      clickRef.removeEventListener('click', handleClick);
    };
  });
};
