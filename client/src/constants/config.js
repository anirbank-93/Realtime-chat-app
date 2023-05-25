// API_SERVER
export const API_URL = 'http://localhost:5000';

// API_NOTIFICATION_MESSAGES
export const API_NOTIFICATION_MESSAGES = {
  loading: {
    title: 'Loading...',
    message: 'Data is being loaded. Please wait',
  },
  success: {
    title: 'Success',
    message: 'Data successfully loaded',
  },
  responseFailure: {
    title: 'Error',
    message:
      'An error occured while fetching response from server. Please try again.',
  },
  requestFailue: {
    title: 'Error',
    message: 'An error occurred while parsing request data.',
  },
  networkError: {
    title: 'Error',
    message:
      'Unable to connect with server. Please check internet connectivity and try again.',
  },
};

// API SERVICE CALL
// SAMPLE REQUEST
// NEED SERVICE CALL: {url: '/', method: 'POST/GET/PUT/DELETE', params: true/false, query: true/false, responseType}
export const SERVICE_URLS = {
  userSignup: { url: '/api/user/register', method: 'POST' },
  userSignin: { url: '/api/user/login', method: 'POST' },
  userSetAvatar: {
    url: '/api/user/set-avatar',
    method: 'PUT',
    params: true,
  },
  getContacts: { url: '/api/user/get-contacts', method: 'GET', params: true },
  addMessage: { url: '/api/message', method: 'POST' },
  exchangedMessages: { url: '/api/message/exchanged-messages', method: 'POST' },
};
