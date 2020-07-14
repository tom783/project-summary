import React,{useEffect} from 'react';
import {
  useDidUpdateEffect,
  useKeyPress,
  useMultiKeyPress
} from 'lib/utils';
import {useImmer} from 'use-immer';
import _ from 'lodash';


const TestState ={
  index:0,
  key:new Set()
}
function Test(props) {
  const [values,setValuse] = useImmer(TestState);

  const downHandler =({ key }) =>{
    console.log(values);
    setValuse(draft=>{
      draft.key.add(key);
    })
  }

  const upHandler = ({ key }) => {
    // console.log(key);
    // keysPressed.delete(key);
    // setKeyPressed(keysPressed);
    // setValuse(draft=>{
    //   draft.key
    // })
    console.log(values);

    setValuse(draft=>{
      draft.key.delete(key);
      // draft.key =values.key.filter(item=> item !== key);
    })
  };

  useEffect(()=>{
    console.log('key change');
    console.log(values.key);
    
    const hasControlKey = values.key.has('Control');
    const hasCKey = values.key.has('c');
    const isCopyKeyCombine = hasControlKey && hasCKey;
    
    if(isCopyKeyCombine){
      console.log('copy!');
    }
  },[values.key])

  // useEffect(() => {
  //   window.addEventListener("keydown", downHandler);
  //   window.addEventListener("keyup", upHandler);
  //   return () => {
  //     window.removeEventListener("keydown", downHandler);
  //     window.removeEventListener("keyup", upHandler);
  //   };
  // }, [downHandler,upHandler]);

  const handleClick= config=>{
    setValuse(draft=>{
      draft.index = values.index+1;
    })
  };

  return (
    <div>
      <button onClick={handleClick}>Test</button>
    </div>
  );
}

export default Test;