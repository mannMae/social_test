// import { history } from '../../redux/store';
import { API_ENDPOINTS } from '../../api/ApiEndpoint';
import { setAuthUser } from '../../redux/actions/Auth';
import http from '../../api/http';

const JWTAuth = {
  onLogin: ({ googleToken }) => {
    return (dispatch) => {
      http
        .post(API_ENDPOINTS.LOGIN, {
          googleToken,
        })
        .then((res) => {
          const userInfo = {};
          let accessToken = res.headers.accessToken;

          localStorage.setItem('accessToken', accessToken);

          //   history.push('/');
        })
        .catch((error) => {
          console.log(error);
        });
    };
  },
};

export default JWTAuth;
