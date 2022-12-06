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
    };
  }
}

export {};
