import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { storage, keys } from 'lib/library';
import { withRouter, Redirect } from 'react-router-dom';
import { AUTH_LOGOUT_SAGAS } from 'store/actions';
import { mapper } from 'lib/mapper';


function Logout() {
  const { pending, success, failure } = useSelector(state => state.auth.logout)
  if (pending) console.log('로그아웃 진행중.');
  if (success) {
    sessionStorage.removeItem(keys.token);
    storage.remove(keys.autoLogin);
    storage.remove('email');
    storage.remove('password');
  }
  if (failure) console.log('로그아웃 실패');

  // NOTE: logout saga
  useEffect(() => {
    AUTH_LOGOUT_SAGAS()
  }, []);

  return success && <Redirect to={mapper.pageUrl.login} />;
}

export default withRouter(Logout);