const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  sendApex: async (channel, apex) => {
    let validChannels = ["apexToMainWithOutput"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, apex); // needs to listen with ipcMain.handle
      return result;
    }
  },
  sendSoql: async (channel, soql) => {
    let validChannels = ["soqlToMainWithOutput"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, soql);
      return result;
    }
  },
  createRecord: async (channel, sObjectType, values, useToolingApi) => {
    let validChannels = ["recordCreateToMainWithOutput"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(
        channel,
        sObjectType,
        values,
        useToolingApi
      );
      return result;
    }
  },
  deleteRecord: async (channel, sObjectType, id, useToolingApi) => {
    let validChannels = ["recordDeleteToMainWithOutput"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(
        channel,
        sObjectType,
        id,
        useToolingApi
      );
      return result;
    }
  },
  listLogs: async (channel) => {
    let validChannels = ["listLogsToMainWithOutput"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel);
      return result;
    }
  },
  getLog: async (channel, logId) => {
    let validChannels = ["getLogToMainWithOutput"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, logId);
      return result;
    }
  },
  bulkDeleteLogs: async (channel) => {
    let validChannels = ["bulkDeleteApexLogs"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel);
      return result;
    }
  },
  fetchCurrentUser: async (channel) => {
    let validChannels = ["fetchCurrentUser"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel);
      return result;
    }
  },
  setDefaultOrg: async (channel, username) => {
    let validChannels = ["setDefaultOrg"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, username);
      return result;
    }
  },
  listLimits: async (channel) => {
    let validChannels = ["listLimits"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel);
      return result;
    }
  },
  listOrgs: async (channel) => {
    let validChannels = ["listOrgs"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel);
      return result;
    }
  },
  setAliasForOrg: async (channel, username, alias) => {
    let validChannels = ["setAliasForOrg"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, username, alias);
      return result;
    }
  },
  openOrg: async (channel, username) => {
    let validChannels = ["openOrg"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, username);
      return result;
    }
  },
  markScratchForDeletion: async (channel, username) => {
    let validChannels = ["markScratchForDeletion"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, username);
      return result;
    }
  },
});
