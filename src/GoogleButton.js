import React from 'react';
import GoogleLogin from 'react-google-login';

const clientId =
  '636788162607-l8mqgvl09o36q5h7umgaru0jtbskrd6r.apps.googleusercontent.com';

const GoogleButton = ({ onSocial }) => {
  const onSuccess = async (response) => {
    console.log(response);

    const {
      googleId,
      profileObj: { email, name },
    } = response;

    await onSocial({
      socialId: googleId,
      socialType: 'google',
      email,
      nickname: name,
    });
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        reponseType={'id_token'}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
};

export default GoogleButton;
