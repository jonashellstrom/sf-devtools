declare global {
  interface Window {
    api: {
      selectFolder: (channel: string) => Promise<string>;
      send: (channel: string, data: string) => Promise<void>;
      runAnonymous: (
        channel: string,
        sfdxPath: string,
        apex: string
      ) => Promise<string>;
      runSoql: (
        channel: string,
        sfdxPath: string,
        soql: string
      ) => Promise<string>;
      createRecord: (
        channel: string,
        sfdxPath: string,
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
        sfdxPath: string,
        sObjectType: string,
        id: string,
        useToolingApi: boolean
      ) => Promise<string>;
      listLogs: (channel: string, sfdxPath: string) => Promise<string>;
      getLog: (
        channel: string,
        sfdxPath: string,
        logId: string
      ) => Promise<string>;
      bulkDeleteLogs: (channel: string, sfdxPath: string) => Promise<void>;
      fetchCurrentUser: (channel: string, sfdxPath: string) => Promise<string>;
      setDefaultOrg: (
        channel: string,
        sfdxPath: string,
        username: string
      ) => Promise<string>;
      listLimits: (channel: string, sfdxPath: string) => Promise<string>;
      listOrgs: (channel: string, sfdxPath: string) => Promise<string>;
      setAliasForOrg: (
        channel: string,
        sfdxPath: string,
        username: string,
        alias: string
      ) => Promise<string>;
      openOrg: (
        channel: string,
        sfdxPath: string,
        username: string
      ) => Promise<string>;
      markScratchForDeletion: (
        channel: string,
        sfdxPath: string,
        username: string
      ) => Promise<string>;
    };
  }
}

export {};
