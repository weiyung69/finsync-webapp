export const msalConfig = {
  auth: {
    clientId: "72a61b07-abb8-449c-a48f-7ceffadf7784", // 替换成 Azure AD 应用的 Client ID
    authority: "https://login.microsoftonline.com/9e72bcc5-65c2-436e-9207-796ec4ceaac3", // 替换成 Tenant ID
    redirectUri: "http://localhost:3000"
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};