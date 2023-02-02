const { app, BrowserWindow } = require('electron');
const path = require('path');
const ngrok = require("ngrok");
const url = require('url')
const fetch = require('node-fetch')
const DiscordRPC = require('discord-rpc')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
      width: 498,
      height: 568,
      minWidth: 498,
      minHeight: 568,
      title: "LocalMiner",
      icon: __dirname + '/logo.ico',
      titleBarStyle: "hidden",
      autoHideMenuBar: true,
      frame: false,
      titleBarOverlay: {
        color: "#1f2937a4",
        symbolColor: "#fff",
      },
      webPreferences: {
        // devTools: true,
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
      }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'web/index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


const clientId = '1068027718534447144';

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({
  transport: 'ipc'
});
const startTimestamp = new Date();

function setActivity() {
  if (!rpc || !mainWindow) {
    return;
  }
  rpc.setActivity({
    details: `Host Minercraft Server for Free`,
    state: "Download now! And Host Your's",
    startTimestamp,
    largeImageKey: 'https://github.com/healer-op/minerweb/blob/main/assests/mcpfp%20-%20MR_HEALER.png?raw=true',
    largeImageText: "Stevie©️",
    smallImageKey: 'https://github.com/healer-op/HealCloud/blob/main/image/6f1e4bd6-bc11-4ba3-b8f2-582fa929d83c.gif?raw=true',
    smallImageText: "Made By Healer-op",
    buttons: [{"label" : "Download" , "url" : `https://github.com/localminer/stevie`}],
    instance: false,
  });
}

rpc.on('ready', () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 3000);
});

rpc.login({
  clientId
}).catch(console.error);
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
