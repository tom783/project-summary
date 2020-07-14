import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Logout } from 'components/base/helpers/auth';
import AuthSignIn from 'pages/auth/AuthSignIn';
import AuthSignUp from 'pages/auth/AuthSignUp';
import AuthResetPassword from 'pages/auth/AuthResetPassword';
import { NotFound } from 'components/base/helpers/error';
import { mapper } from 'lib/mapper';

function Auth() {
  return (
    <Switch>
      <Route path={`${mapper.pageUrl.login}`} component={AuthSignIn} />
      <Route path={`${mapper.pageUrl.signUp}`} component={AuthSignUp} />
      <Route path={`${mapper.pageUrl.resetPassword}`} component={AuthResetPassword} />
      <Route path={`${mapper.pageUrl.logout}`} component={Logout} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default withRouter(Auth);
