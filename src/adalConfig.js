// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable filenames/match-regex */
import {AuthenticationContext, adalFetch, withAdalLogin} from 'react-adal';

// api: '4595abb4-08dc-4115-ab0a-46965d334a57'
// clientId: "4595abb4-08dc-4115-ab0a-46965d334a57", // swagger

export const adalConfig = {
  tenant: '72f988bf-86f1-41af-91ab-2d7cd011db47',
  clientId: '748957cb-2ecf-48ee-a937-2303a37d20ab', // FC
  endpoints: {
    // api: 'https://microsoft.onmicrosoft.com/bf9bd303-6141-4d3b-92f5-652600d47043'
    api: '32d569e3-ae28-4dc7-9a3d-254533130024'
    // 'https://fyc-dev.azurewebsites.net/': '748957cb-2ecf-48ee-a937-2303a37d20ab'
    // api: 'bf9bd303-6141-4d3b-92f5-652600d47043'
  }
  // cache748957cb-2ecf-48ee-a937-2303a37d20ab
};

export const authContext = new AuthenticationContext(adalConfig);

export function adalApiFetch(fetch, url, options) {
  return adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);
}

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);
