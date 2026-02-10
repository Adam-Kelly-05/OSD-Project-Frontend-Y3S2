import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_CE1rF5NoX',
    authWellknownEndpointUrl:
      'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_CE1rF5NoX/.well-known/openid-configuration',
    clientId: 'kpb76hp7r9afkr0gupoj1k7gn',
    redirectUrl: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/',
    responseType: 'code',
    scope: 'email openid profile',
    silentRenew: true,
    useRefreshToken: true,
  },
};
