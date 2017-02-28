import CBioPortalAPIInternal from "./CBioPortalAPIInternal";
import AppConfig from 'appConfig';

const client = new CBioPortalAPIInternal(`//${AppConfig.apiRoot}`);
export default client;
