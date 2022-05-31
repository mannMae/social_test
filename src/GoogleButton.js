import React, { useCallback, useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useDispatch } from 'react-redux';
import JWTAuth from './services/auth';
import http from './api/http';
import { API_ENDPOINTS } from './api/ApiEndpoint';
import styled from 'styled-components';

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
  const [isLogin, setIsLogin] = useState(false);

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
      .post(
        API_ENDPOINTS.LOGIN,
        {
          google_token: response.tokenId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        let accessToken = res.data.token.access_token;
        console.log(res);
        localStorage.setItem('accessToken', accessToken);
        setIsLogin(true);
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

  const onLogoutSuccess = () => {
    setIsLogin(false);
    console.log(isLogin);

    const access_token = localStorage.getItem('accessToken');
    // function deleteCookie(name) {
    //   document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // }
    http
      .post(API_ENDPOINTS.LOGOUT, { access_token })
      .then((res) => {
        localStorage.removeItem('accessToken');
        // deleteCookie('access_token');
        window.alert('로그아웃 되었습니다.');
        setIsLogin(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  return (
    <div>
      {!isLogin ? (
        <GoogleLogin
          clientId={clientId}
          // reponseType={'id_token'}
          buttonText="구글아이디로 로그인하기"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      ) : (
        <LogoutButton onClick={onLogoutSuccess}>로그아웃</LogoutButton>
      )}
    </div>
  );
};

export default GoogleButton;

const LogoutButton = styled.button`
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 200px;
  height: 30px;
  cursor: pointer;
`;
