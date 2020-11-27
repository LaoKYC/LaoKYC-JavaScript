import Configuration, { renderUI, showTokens } from './libs/kyc-oidc.js'

var config = new Configuration('https://login.oneid.sbg.la',
    'js',
    'https://localhost:44300/callback',
    'https://localhost:44300/',
    'code', 'openid LaoKYC phone profile mkyc_api', true);

renderUI(config, 'lo');

showTokens(config, '#token');