import React, { useCallback, useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useDispatch } from 'react-redux';
import JWTAuth from './services/auth';
import http from './api/http';
import { API_ENDPOINTS } from './api/ApiEndpoint';
import styled from 'styled-components';
import AppleLogin from 'react-apple-login';

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
  const [userInfo, setUserInfo] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userId, setUserId] = useState(0);

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
        setUserEmail(res.data.token.email);
        setUserNickname(res.data.token.nickname);
        // setUserInfo({
        //   email: res.data.token.email,
        //   nickname: res.data.token.nickname,
        //   profileImg: '',
        // });
        //   history.push('/');
      })
      .then((res) => console.log(userInfo))
      .catch((error) => {
        console.log(error);
      });
    // dispatch(JWTAuth.onLogin(response.tokenId));
    console.log(response);
  };

  const onFailure = (response) => {
    console.log(response);
  };

  const onLogout = () => {
    setIsLogin(false);
    console.log(isLogin);

    const access_token = localStorage.getItem('accessToken');
    // function deleteCookie(name) {
    //   document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // }
    http
      .post(API_ENDPOINTS.LOGOUT, { access_token }, { withCredentials: true })
      .then((res) => {
        localStorage.removeItem('accessToken');
        // deleteCookie('access_token');
        window.alert('???????????? ???????????????.');
        setIsLogin(false);
        setUserInfo({});
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const getUserInfo = (e) => {
    e.preventDefault();
    http
      .get(API_ENDPOINTS.GETINFO)
      .then((res) => {
        setUserId(res.data.user_id);
        console.log(userId);
      })
      .catch((error) => console.log(error));
  };

  const editUserInfo = (e) => {
    e.preventDefault();
    setUserInfo({
      email: userEmail,
      nickname: userNickname,
      profileImg: '',
    });

    const regExp = /^[???-???a-zA-Z]{2,20}$/;
    const nickcnameCheck = regExp.test(userNickname);
    console.log(userNickname, nickcnameCheck);
    if (nickcnameCheck) {
      http
        .put(`${API_ENDPOINTS.EDITINFO}/${userId}`, { nickname: userNickname })
        .then((res) => window.alert('??????????????? ?????????????????????.'))
        .catch((error) => console.log(error.response));
    } else {
      window.alert('???????????? ????????? ?????? ????????????.');
    }
  };

  const userWithdrawals = (e) => {
    e.preventDefault();
    http
      .delete(`${API_ENDPOINTS.WITHDRAWAL}/${userId}`)
      .then((res) => window.alert('???????????? ???????????????.'))
      .catch((error) => console.log(error.response));
  };
  const post = (e) => {
    e.preventDefault();
    http
      .post(`${API_ENDPOINTS.POST}`, { test: 'test' })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };
  return (
    <div>
      {!isLogin ? (
        <>
          <GoogleLogin
            clientId={clientId}
            // reponseType={'id_token'}
            buttonText="?????????????????? ???????????????"
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
          <AppleLogin
            clientId={'com.react.apple.login'}
            redirectURI={'https://redirectUrl.com'}
            responseType={'code'}
            responseMode={'query'}
            usePopup={false}
            designProp={{
              height: 30,
              width: 140,
              color: 'black',
              border: false,
              type: 'sign-in',
              border_radius: 15,
              scale: 1,
              locale: 'en_US',
            }}
          />
        </>
      ) : (
        <LogoutButton onClick={onLogout}>????????????</LogoutButton>
      )}
      <Form>
        <label>
          E-Mail
          <input
            defaultValue={userInfo.email}
            onChange={(e) => setUserEmail(e.target.value)}
            readOnly
          />
        </label>
        <label>
          Nickname
          <input
            defaultValue={userInfo.nickname}
            onChange={(e) => setUserNickname(e.target.value)}
          />
        </label>
        <button onClick={getUserInfo}>???????????? ??????</button>
        <button onClick={editUserInfo}>???????????? ??????</button>
        <button onClick={userWithdrawals}>????????????</button>
        <button onClick={post}>POST</button>
      </Form>
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

const Form = styled.form`
  width: 300px;
  height: 300px;
  justify-content: space-around;
  display: flex;
  margin: 10px auto;
  flex-direction: column;
  text-align: center;
  align-items: center;
  color: #fff;
  background-color: #555;
  button {
    width: 150px;
  }
`;
