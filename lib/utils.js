export const getHeaders = (tenant, token, locale, method = 'GET') => {
  // This is taken from stripes-connect/OkapiResource.js
  const headers = {
    POST: {
      Accept: 'application/json',
    },
    DELETE: {
      Accept: 'text/plain',
    },
    GET: {
      Accept: 'application/json',
    },
    PUT: {
      Accept: 'text/plain',
    },
  };

  return {
    ...headers[method],
    'Accept-Language': locale,
    'Content-Type': 'application/json',
    'X-Okapi-Tenant': tenant,
    ...(token && { 'X-Okapi-Token': token }),
  };
};
