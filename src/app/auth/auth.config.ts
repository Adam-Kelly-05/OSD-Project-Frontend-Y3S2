import { environment } from '../../environments/environment';

export const authConfig = {
  config: {
    authority: environment.cognitoAuthority,
    authWellknownEndpointUrl: environment.cognitoWellknownEndpointUrl,
    clientId: environment.cognitoClientId,
    scope: 'openid profile email',
    responseType: 'code',
    redirectUrl: window.location.origin + '/auth/callback',
    customParamsEndSessionRequest: {
      client_id: environment.cognitoClientId,
      logout_uri: window.location.origin + '/',
    },
    secureRoutes: [environment.apiUri],
    silentRenew: true,
    useRefreshToken: true,
  },
};
