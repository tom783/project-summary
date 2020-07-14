import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DashboardNav, ExecutorNav } from 'components/common/nav';
import { useImmer } from 'use-immer';
import { withRouter } from 'react-router-dom';


function NavContainer(props) {
  const { type } = props;
  const {
    auth: authReducer,
    base: baseReducer,
    mypage: mypageReducer
  } = useSelector(state => state);
  const { signIn } = authReducer;

  const [values, setValues] = useImmer({
    updateCount: 0,
    profile: signIn.profile
  });

  const typeObj = {
    "dashboard": DashboardNav,
    "executor": ExecutorNav
  }
  useEffect(() => {
    if (mypageReducer.myinfo.update.success) {
      if (mypageReducer.myinfo.success) {
        setValues(draft => {
          draft.profile.profile = mypageReducer.myinfo.userInfo.profile;
        });
      }
    }
  }, [mypageReducer.myinfo.update, mypageReducer.myinfo.success]);

  const Nav = typeObj[type];
  if (!Nav) return null;
  return (
    <Nav
      auth={authReducer}
      info={baseReducer}
      profile={values.profile}

    />
  );
}

export default withRouter(NavContainer);


// import {Actions} from 'store/actionCreators';
// const handleToggle =()=>{
//   Actions.common_executor_nav();
// }
// profile={signIn.profile}
// handleToggle={handleToggle}