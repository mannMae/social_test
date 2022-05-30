import React, { useCallback, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useDispatch } from 'react-redux';
import JWTAuth from './services/auth';
import http from './api/http';
import { API_ENDPOINTS } from './api/ApiEndpoint';

const clientId =
  '463010698088-4165vl983gosnd12r6k701udsod84r0k.apps.googleusercontent.com';

const GoogleButton = ({ onSocial }) => {
  // const dispatch = useDispatch();
  //   const onSuccess = async (response) => {
  //     console.log(response);

  //     const {
  //       googleId,
  //       profileObj: { email, name },
  //     } = response;

  //     await onSocial({
  //       socialId: googleId,
  //       socialType: 'google',
  //       email,
  //       nickname: name,
  //     });
  //     console.log(response);
  //   };

  // const onSuccess = useCallback((response) => {
  //   const idToken = response.tokenId;
  //   const data = {
  //     email: response.profileObj.email,
  //     first_name: response.profileObj.givenName,
  //     last_name: response.profileObj.familyName,
  //   };

  //   validateTokenAndObtainSession({ data, idToken })
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err));
  // });

  // const onFailure = (error) => {
  //   console.log(error);
  // };

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
    http
      .post(API_ENDPOINTS.LOGIN, {
        access_token: response.tokenId,
      })
      .then((res) => {
        const userInfo = {};
        let accessToken = res.headers.accessToken;
        console.log(res);
        localStorage.setItem('accessToken', accessToken);

        //   history.push('/');
      })
      .catch((error) => {
        console.log(error);
      });

    // dispatch(JWTAuth.onLogin(response.tokenId));
    console.log(response);
  };

  const onFailure = (response) => {
    console.log(response);
  };
  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        // reponseType={'id_token'}
        buttonText="구글아이디로 로그인하기"
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
};

export default GoogleButton;
