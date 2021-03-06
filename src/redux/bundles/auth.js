import merge from 'lodash.merge';
import { saveToken, removeToken } from 'helpers';
import { pushState } from 'redux-router';

const SET_ACCESS_TOKEN = 'auth/setAccessToken';
const SIGN_IN_REQUEST = 'auth/signInRequest';
const SIGN_IN_SUCCESS = 'auth/signInSuccess';
const SIGN_IN_FAILURE = 'auth/signInFailure';
const SIGN_OUT = 'auth/signOut';
const TOKEN_INFO_REQUEST = 'auth/tokenInfoRequest';
const TOKEN_INFO_SUCCESS = 'auth/tokenInfoSuccess';
const TOKEN_INFO_FAILURE = 'auth/tokenInfoFailure';

const INITIAL_STATE = {
  accessToken: null,
  isSigningIn: false,
  isSignedIn: false
};

export default function(state = INITIAL_STATE, action){
  switch(action.type) {
  case SET_ACCESS_TOKEN:
    return merge({}, state, {
      accessToken: action.accessToken
    });
  case SIGN_IN_REQUEST:
    return merge({}, state, {
      isSigningIn: true
    });
  case SIGN_IN_SUCCESS:
    return merge({}, state, {
      isSigningIn: false,
      isSignedIn: true,
      accessToken: action.response.access_token
    });
  case SIGN_IN_FAILURE:
    return merge({}, state, {
      isSigningIn: false
    });
  case SIGN_OUT:
    return merge({}, state, {
      isSignedIn: false,
      accessToken: null
    });
  case TOKEN_INFO_REQUEST:
    return merge({}, state, {
      isTokenChecking: true
    });
  case TOKEN_INFO_SUCCESS:
    return merge({}, state, {
      isTokenChecking: false,
      isTokenValid: true,
      isSignedIn: true
    });
  case TOKEN_INFO_FAILURE:
    return merge({}, state, {
      isTokenChecking: false,
      isTokenValid: false,
      isSignedIn: false,
      accessToken: null
    });
  }
  return state;
}

export function redirectIfSignedIn(redirectUrl = '/') {
  return (dispatch, getState) => {
    const { isSignedIn, accessToken } = getState().auth;
    (accessToken || isSignedIn) && dispatch(pushState(null, redirectUrl));
  };
}

export function signIn(username, password){
  return {
    apiMiddleware: {
      types: [SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE],
      caller: (api) => {
        return api.authenticate(username, password);
      },
      after: (action, dispatch, getState) => {
        if(action.type === SIGN_IN_SUCCESS) {
          const nextPath = getState().router.location.query.nextPath || '/';
          saveToken(action.response.access_token);
          dispatch(pushState(null, nextPath));
        }
      }
    }
  };
}

export function authenticateUser(){
  return {
    apiMiddleware: {
      types: [TOKEN_INFO_REQUEST, TOKEN_INFO_SUCCESS, TOKEN_INFO_FAILURE],
      caller: (api, getState) => {
        const { accessToken } = getState().auth;
        return api.fetchTokenInfo(accessToken);
      },
      after: (action, dispatch, getState) => {
        if (action.type === TOKEN_INFO_FAILURE) {
          const nextPath = getState().router.location.pathname;
          dispatch(pushState(null, '/sign_in', { nextPath }));
        }
      }
    }
  };
}

export function signOut() {
  console.log('signOut');
  return (dispatch) => {
    removeToken();
    dispatch({ type: SIGN_OUT });
  };
}

export function setAccessToken(accessToken) {
  return {
    type: SET_ACCESS_TOKEN,
    accessToken
  };
}
