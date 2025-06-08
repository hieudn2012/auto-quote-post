"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("api", {
  getCurrentTime: () => electron.ipcRenderer.invoke("get-current-time"),
  runProfile: (profileId) => electron.ipcRenderer.invoke("run-profile", profileId),
  stopProfile: (profileId) => electron.ipcRenderer.invoke("stop-profile", profileId),
  sharePost: (profileId) => electron.ipcRenderer.invoke("share-post", profileId),
  getAllError: () => electron.ipcRenderer.invoke("get-all-error"),
  getAllHistory: () => electron.ipcRenderer.invoke("get-all-history"),
  getSettings: () => electron.ipcRenderer.invoke("get-settings"),
  saveSettings: (settings) => electron.ipcRenderer.invoke("save-settings", settings)
});
