const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  selectFolder: () => ipcRenderer.invoke("dialog:openDirectory"),
  runAnonymous: async (channel, sfdxPath, apex) => {
    let validChannels = ["runAnonymous"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath, apex); // needs to listen with ipcMain.handle
      return result;
    }
  },
  runSoql: async (channel, sfdxPath, soql) => {
    let validChannels = ["runSoql"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath, soql);
      return result;
    }
  },
  createRecord: async (
    channel,
    sfdxPath,
    sObjectType,
    values,
    useToolingApi
  ) => {
    let validChannels = ["createRecord"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(
        channel,
        sfdxPath,
        sObjectType,
        values,
        useToolingApi
      );
      return result;
    }
  },
  deleteRecord: async (channel, sfdxPath, sObjectType, id, useToolingApi) => {
    let validChannels = ["deleteRecord"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(
        channel,
        sfdxPath,
        sObjectType,
        id,
        useToolingApi
      );
      return result;
    }
  },
  listLogs: async (channel, sfdxPath) => {
    let validChannels = ["listLogs"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath);
      return result;
    }
  },
  getLog: async (channel, sfdxPath, logId) => {
    let validChannels = ["getLog"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath, logId);
      return result;
    }
  },
  bulkDeleteLogs: async (channel, sfdxPath) => {
    let validChannels = ["bulkDeleteLogs"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath);
      return result;
    }
  },
  fetchCurrentUser: async (channel, sfdxPath) => {
    let validChannels = ["fetchCurrentUser"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath);
      return result;
    }
  },
  setDefaultOrg: async (channel, sfdxPath, username) => {
    let validChannels = ["setDefaultOrg"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath, username);
      return result;
    }
  },
  listLimits: async (channel, sfdxPath) => {
    let validChannels = ["listLimits"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath);
      return result;
    }
  },
  listOrgs: async (channel, sfdxPath) => {
    let validChannels = ["listOrgs"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath);
      return result;
    }
  },
  setAliasForOrg: async (channel, sfdxPath, username, alias) => {
    let validChannels = ["setAliasForOrg"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(
        channel,
        sfdxPath,
        username,
        alias
      );
      return result;
    }
  },
  openOrg: async (channel, sfdxPath, username) => {
    let validChannels = ["openOrg"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath, username);
      return result;
    }
  },
  markScratchForDeletion: async (channel, sfdxPath, username) => {
    let validChannels = ["markScratchForDeletion"];
    if (validChannels.includes(channel)) {
      const result = await ipcRenderer.invoke(channel, sfdxPath, username);
      return result;
    }
  },
});
