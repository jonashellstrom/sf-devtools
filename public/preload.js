const { contextBridge, ipcRenderer } = require("electron");

const VALID_CHANNELS = [
  "runAnonymous",
  "runSoql",
  "createRecord",
  "deleteRecord",
  "listLogs",
  "getLog",
  "bulkDeleteLogs",
  "fetchCurrentUser",
  "setDefaultOrg",
  "listLimits",
  "listOrgs",
  "setAliasForOrg",
  "openOrg",
  "markScratchForDeletion",
];

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  selectFolder: () => ipcRenderer.invoke("dialog:openDirectory"),
  on: async (channel, sfdxPath, args) => {
    if (VALID_CHANNELS.includes(channel)) {
      const invokeArgs = args
        ? [channel, sfdxPath, ...args]
        : [channel, sfdxPath];
      const result = await ipcRenderer.invoke(...invokeArgs);
      return result;
    }
  },
});
