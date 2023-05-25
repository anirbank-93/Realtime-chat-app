export const getTokens = () => {
  return {
    'x-access-token': sessionStorage.getItem('accessToken'),
    'x-refresh': sessionStorage.getItem('refreshToken'),
    'Access-Control-Allow-Origin': '*',
  };
};

export const getTypes = (value, body) => {
  if (value.params) {
    if (typeof body == 'object') {
      return { params: { id: body.id }, body: body };
    } else {
      return { params: null, body: body };
    }
  } else if (value.query) {
    return { query: body };
  }

  return {};
};
