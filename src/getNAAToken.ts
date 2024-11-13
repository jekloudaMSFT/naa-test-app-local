import {
  AccountInfo,
  Configuration,
  IPublicClientApplication,
  LogLevel,
  createNestablePublicClientApplication,
} from "@azure/msal-browser";
import { app } from "@microsoft/teams-js";

const msalConfig: Configuration = {
  auth: {
    clientId: "e7312545-2a09-4b59-af71-b92baa952ad8",
    authority: "https://login.microsoftonline.com/46e59dd7-fe9c-4b20-bcca-bca6dab68e43",
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Verbose,
      loggerCallback: (level, message, containsPii) => {
        switch (level) {
          case 0:
            console.error(message);
            return;
          case 1:
            console.warn(message);
            return;
          case 2:
            console.info(message);
            return;
          case 3:
            console.log(message);
            return;
        }
      },
      piiLoggingEnabled: true
    },
  },
};

let pca: IPublicClientApplication;

export function initializePublicClient(): Promise<IPublicClientApplication> {
  console.log("Starting initializePublicClient");
  return createNestablePublicClientApplication(msalConfig).then(
    (result) => {
      console.log("Client app created");
      pca = result;
      return pca;
    }
  );
}

export function getNAAToken(): Promise<string> {
  console.log("Starting getNAAToken");
  if (!pca) {
    return initializePublicClient().then((_client) => {
      return getToken();
    });
  } else {
    return getToken();
  }
}

export async function getActiveAccount(): Promise<AccountInfo | null> {
  console.log("Starting getActiveAccount");
  let activeAccount = null;
  try {
    console.log("getting active account");
    activeAccount = pca.getActiveAccount();
  } catch (error) {
    console.log(error);
  }

  if (!activeAccount) {
    console.log("No active account, trying login popup");
    try {
      const context = await app.getContext();
      const accountFilter = {
        tenantId: context.user?.tenant?.id,
        homeAccountId: context.user?.id,
        loginHint: (await app.getContext()).user?.loginHint
      };
      const accountWithFilter = pca.getAccount(accountFilter);
      if (accountWithFilter) {
        activeAccount = accountWithFilter;
        pca.setActiveAccount(activeAccount);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return activeAccount;
}

export async function getToken(): Promise<string> {
  let activeAccount = await getActiveAccount();

  const tokenRequest = {
    scopes: ["User.Read"],
    account: activeAccount || undefined,
  };

  return pca
    .acquireTokenSilent(tokenRequest)
    .then((result) => {
      console.log(result);
      return result.accessToken;
    })
    .catch((error) => {
      console.log(error);
      // try to get token via popup
      return pca
        .acquireTokenPopup(tokenRequest)
        .then(async (result) => {
          console.log(result);
          return result.accessToken;
        })
        .catch((error) => {
          console.log(error);
          return JSON.stringify(error);
        });
    });
}

export async function getTokenAndFetchUser(): Promise<string> {
  return getToken().then((token) => {
    return fetchUserFromGraph(token);
  });
}

async function fetchUserFromGraph(accessToken: string): Promise<string> {
  const requestString = "https://graph.microsoft.com/v1.0/me";
  const headersInit = { Authorization: accessToken };
  const requestInit = { headers: headersInit };
  if (requestString !== undefined) {
    const result = await fetch(requestString, requestInit);
    if (result.ok) {
      const data = await result.text();
      console.log(data);
      return data;
    } else {
      //Handle whatever errors could happen that have nothing to do with identity
      console.log(result);
      return JSON.stringify(result);
    }
  } else {
    //throw this should never happen
    throw new Error("unexpected: no requestString");
  }
}
