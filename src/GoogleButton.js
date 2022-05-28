import React, { useCallback, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';

const clientId =
  '636788162607-l8mqgvl09o36q5h7umgaru0jtbskrd6r.apps.googleusercontent.com';

const GoogleButton = ({ onSocial }) => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const onSuccess = (response) => {
    console.log(response);
  };

  const onFailure = (response) => {
    console.log(response);
  };
  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="구글아이디로 로그인하기"
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
};

export default GoogleButton;
