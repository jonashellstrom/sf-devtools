const { app, BrowserWindow, ipcMain, dialog, protocol } = require("electron");
const path = require("path");
const { exec: childProcessExec } = require("child_process");

const CLI_JSON_SANITIZING_PATTERN =
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 840,
    minHeight: 500,
    minWidth: 900,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const appURL = app.isPackaged
    ? URL.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";

  win.loadURL(appURL); // Load app

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  try {
    protocol.registerHttpProtocol(
      "file",
      (request, callback) => {
        const url = request.url.substring(8);
        callback({ path: path.normalize(`${__dirname}/${url}`) });
      },
      (error) => {
        if (error) console.error("Failed to register protocol");
      }
    );
  } catch (error) {
    console.error("error setting up local files normalizer proxy");
  }
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

function exec(command) {
  return new Promise(function (resolve, reject) {
    childProcessExec(
      command,
      { maxBuffer: 1024 * 30_000 },
      (error, stdout, _stderr) => {
        if (error) {
          reject(stdout.trim());
          return;
        }
        resolve(stdout.trim());
      }
    );
  });
}

ipcMain.handle("dialog:openDirectory", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
});

ipcMain.handle("runAnonymous", async (_event, sfdxPath, apex) => {
  try {
    await exec(`cd ${sfdxPath} && echo "${apex}" > sfdevtoolstemp.apex`);
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:apex:execute -f sfdevtoolstemp.apex --json && rm sfdevtoolstemp.apex`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    await exec(`cd ${sfdxPath} && rm sfdevtoolstemp.apex`);
    return "An error occured";
  }
});

ipcMain.handle("runSoql", async (_event, sfdxPath, soql) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:data:soql:query -q "${soql}" --usetoolingapi --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle(
  "createRecord",
  async (_event, sfdxPath, sObjectType, values, useToolingApi) => {
    try {
      const cliJsonOutput = await exec(
        `cd ${sfdxPath} && sfdx force:data:record:create --sobjecttype ${sObjectType} -v "${values}" ${
          useToolingApi ? "--usetoolingapi" : ""
        } --json`
      );
      return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
    } catch (error) {
      return error.replace(CLI_JSON_SANITIZING_PATTERN, "");
    }
  }
);

ipcMain.handle(
  "deleteRecord",
  async (_event, sfdxPath, sObjectType, id, useToolingApi) => {
    try {
      const cliJsonOutput = await exec(
        `cd ${sfdxPath} && sfdx force:data:record:delete --sobjecttype ${sObjectType} -i ${id} ${
          useToolingApi ? "--usetoolingapi" : ""
        } --json`
      );
      return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
    } catch (_error) {
      return "An error occured";
    }
  }
);

ipcMain.handle("listLogs", async (_event, sfdxPath) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:apex:log:list --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("getLog", async (_event, sfdxPath, logId) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:apex:log:get -i ${logId} --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    console.error("an error in main.js!! error: ", _error);
    return "An error occured";
  }
});

ipcMain.handle("bulkDeleteLogs", async (_event, sfdxPath) => {
  try {
    await exec(
      `cd ${sfdxPath} && sfdx force:data:soql:query -t -q "SELECT Id FROM ApexLog" -r "csv" > apex-logs-to-delete.csv`
    );
    await exec(
      `cd ${sfdxPath} && sfdx force:data:bulk:delete -s ApexLog -f apex-logs-to-delete.csv && rm apex-logs-to-delete.csv`
    );
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("fetchCurrentUser", async (_event, sfdxPath) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:user:display --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("setDefaultOrg", async (_event, sfdxPath, username) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:config:set defaultusername=${username} --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("listOrgs", async (_event, sfdxPath) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:org:list --verbose --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("listLimits", async (_event, sfdxPath) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:limits:api:display --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("setAliasForOrg", async (_event, sfdxPath, username, alias) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx alias:set ${alias}=${username} --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("openOrg", async (_event, sfdxPath, username) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:org:open -u ${username}`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("markScratchForDeletion", async (_event, sfdxPath, username) => {
  try {
    const cliJsonOutput = await exec(
      `cd ${sfdxPath} && sfdx force:org:delete -u ${username} --json --noprompt`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});
