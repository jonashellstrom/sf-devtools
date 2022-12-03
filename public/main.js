const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { exec: childProcessExec } = require("child_process");

const CLI_JSON_SANITIZING_PATTERN =
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let homePath;
const SF_PROJECT_PATH = "path/to/sfproject";

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
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
        const url = request.url.substr(8);
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
  homePath = app.getPath("home");

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
// the user quits  explicitly with Cmd + Q.
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
    childProcessExec(command, (error, stdout, _stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

ipcMain.on("toMain", (event, args) => {
  fs.readFile("path/to/file", (error, data) => {
    // Send result back to renderer process
    win.webContents.send("fromMain", { test: "hello" });
  });
});

ipcMain.handle("apexToMainWithOutput", async (event, apex) => {
  try {
    await exec(
      `cd ${homePath}/${SF_PROJECT_PATH} && echo "${apex}" > temp.apex`
    );
    const cliJsonOutput = await exec(
      `cd ${homePath}/${SF_PROJECT_PATH} && sfdx force:apex:execute -f temp.apex --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle("soqlToMainWithOutput", async (event, soql) => {
  try {
    // TODO: make tooling api an input
    const cliJsonOutput = await exec(
      `cd ${homePath}/${SF_PROJECT_PATH} && sfdx force:data:soql:query -q "${soql}" --usetoolingapi --json`
    );
    return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
  } catch (_error) {
    return "An error occured";
  }
});

ipcMain.handle(
  "recordCreateToMainWithOutput",
  async (event, sObjectType, values, useToolingApi) => {
    try {
      const cliJsonOutput = await exec(
        `cd ${homePath}/${SF_PROJECT_PATH} && sfdx force:data:record:create --sobjecttype ${sObjectType} -v "${values}" ${
          useToolingApi ? "--usetoolingapi" : ""
        } --json`
      );
      return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
    } catch (_error) {
      return "An error occured";
    }
  }
);

ipcMain.handle(
  "recordDeleteToMainWithOutput",
  async (event, sObjectType, id, useToolingApi) => {
    try {
      console.log(
        "query: ",
        `sfdx force:data:record:delete --sobjecttype ${sObjectType} -i ${id} ${
          useToolingApi ? "--usetoolingapi" : ""
        } --json`
      );
      const cliJsonOutput = await exec(
        `cd ${homePath}/${SF_PROJECT_PATH} && sfdx force:data:record:delete --sobjecttype ${sObjectType} -i ${id} ${
          useToolingApi ? "--usetoolingapi" : ""
        } --json`
      );
      return cliJsonOutput.replace(CLI_JSON_SANITIZING_PATTERN, "");
    } catch (_error) {
      return "An error occured";
    }
  }
);
