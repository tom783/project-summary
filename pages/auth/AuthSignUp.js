import React from 'react';
import SignUpContainer from 'containers/auth/SignUpContainer';
import { AuthTemplate } from 'components/base/template';

function AuthSignUp() {
  return (
    <AuthTemplate staticPage={true}>
      <SignUpContainer />
    </AuthTemplate>
  );
}

export default AuthSignUp;