import axios from 'axios';

import {
  API_URL,
  API_NOTIFICATION_MESSAGES,
  SERVICE_URLS,
} from '../constants/config';
import { getTokens, getTypes } from '../utils/common-utils';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    if (config.TYPE.params) {
      config.url = config.url + '/' + config.TYPE.params.id;
    } else if (config.TYPE.query) {
      config.url = config.url + config.TYPE.query;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // Stop the global loader here
    return processResponse(response);
  },
  function (error) {
    // Stop the global loader here
    return processError(error); // Promise.reject()
  }
);

////////////////////////////////
// if success -> return { isSuccess: true, data: object }
// if failure -> return { isFailure: true, status: string, msg: string, code: int }
////////////////////////////////
const processResponse = (response) => {
  if (response.status == 200 || response.status == 201) {
    return { isSuccess: true, data: response.data };
  } else {
    return {
      isFailure: true,
      status: response?.status,
      msg: response?.msg,
      code: response?.code,
    };
  }
};

const processError = (error) => {
  if (error.response) {
    // Request made but server response status code is other than 2xx
    console.log('ERROR IN RESPONSE: ', error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.responseFailure,
      code: error.response.status,
      error: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response received, maybe due to no connectivity
    console.log('ERROR IN NETWORK: ', error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.networkError,
      code: '',
    };
  } else {
    // Something happened in setting up request that triggers an error
    console.log('ERROR IN REQUEST: ', error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.requestFailue,
      code: '',
    };
  }
};

const JSON_API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {
  JSON_API[key] = (body, showUploadProgress, showDownloadProgress) =>
    axiosInstance({
      method: value.method,
      url: value.url,
      data: body,
      responseType: value.responseType,
      headers: getTokens(),
      TYPE: getTypes(value, body),
      onUploadProgress: function (progressEvent) {
        if (showUploadProgress) {
          let percentageCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showUploadProgress(percentageCompleted);
        }
      },
      onDownloadProgress: function (progressEvent) {
        if (showDownloadProgress) {
          let percentageCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showDownloadProgress(percentageCompleted);
        }
      },
    });
}

export { JSON_API };
