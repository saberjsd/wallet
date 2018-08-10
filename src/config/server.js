const api={
     dappId: "1847c9d186b72963fff6fa8d5c9d26d534c32d4d65dc984e09b881ef71bd6409",
     baseUrl: 'http://47.75.158.207:8192',
}
const dappBaseUrl=api.baseUrl+"/api/dapps/"+api.dappId;
const magic_test="594fe0f3";
const magic_mainnet="5f5b3cf5";
export default {
    aschTrans:api.baseUrl+"/peer/transactions",
    asset:api.baseUrl+"/api/v2/balances/",
    height:dappBaseUrl+ "/blocks/height",
    xas:api.baseUrl+ "/api/accounts/getBalance/",
    baseUrl:api.baseUrl,
    dappid:api.dappId,
    loginApi:api.baseUrl+"/api/accounts/open2",
    registerApi:api.baseUrl+"/api/accounts/new",
    tixian:dappBaseUrl+"/transactions/signed",
    UiaTrans:api.baseUrl+"/peer/transactions",
    assetTransfers:api.baseUrl+"/api/uia/transactions/my",
    UiaMessage:api.baseUrl+"/api/v2/balances/",
    setNickname:dappBaseUrl+"/transactions/unsigned",
    balances:dappBaseUrl+"/balances/",
    getTransation:dappBaseUrl+"/transactions",
    transfers:dappBaseUrl+"/transfers",
    cy: "ubiquity.USO",
    magic:magic_mainnet,
}