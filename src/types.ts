declare global {
  interface Window {
    api: {
      receive: (channel: string, func: (data: any) => void) => Promise<void>;
      send: (channel: string, data: string) => Promise<void>;
      sendApex: (channel: string, apex: string) => Promise<string>;
      sendSoql: (channel: string, soql: string) => Promise<string>;
      createRecord: (
        channel: string,
        sObjectType: string,
        values: string,
        useToolingApi: boolean
      ) => Promise<string>;
      updateRecord: (
        channel: string,
        sObjectType: string,
        values: string,
        useToolingApi: boolean
      ) => Promise<string>;
      deleteRecord: (
        channel: string,
        sObjectType: string,
        id: string,
        useToolingApi: boolean
      ) => Promise<string>;
      listLogs: (channel: string) => Promise<string>;
      getLog: (channel: string, logId: string) => Promise<string>;
      bulkDeleteLogs: (channel: string) => Promise<void>;
      fetchCurrentUser: (channel: string) => Promise<string>;
      setDefaultOrg: (channel: string, username: string) => Promise<string>;
      listLimits: (channel: string) => Promise<string>;
      listOrgs: (channel: string) => Promise<string>;
      setAliasForOrg: (
        channel: string,
        username: string,
        alias: string
      ) => Promise<string>;
      openOrg: (channel: string, username: string) => Promise<string>;
      markScratchForDeletion: (
        channel: string,
        username: string
      ) => Promise<string>;
    };
  }
}

export {};
