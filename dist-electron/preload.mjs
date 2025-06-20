"use strict";
const electron = require("electron");
var InvokeChannel = /* @__PURE__ */ ((InvokeChannel2) => {
  InvokeChannel2["GET_CURRENT_TIME"] = "get-current-time";
  InvokeChannel2["RUN_PROFILE"] = "run-profile";
  InvokeChannel2["STOP_PROFILE"] = "stop-profile";
  InvokeChannel2["GET_SETTINGS"] = "get-settings";
  InvokeChannel2["GET_SETTING_BY_PROFILE_ID"] = "get-setting-by-profile-id";
  InvokeChannel2["OPEN_SELECT_FOLDER"] = "open-select-folder";
  InvokeChannel2["SYNC_PROFILE"] = "sync-profile";
  InvokeChannel2["GET_PROFILES_FROM_JSON"] = "get-profiles-from-json";
  InvokeChannel2["SAVE_SETTINGS"] = "save-settings";
  return InvokeChannel2;
})(InvokeChannel || {});
const invoke = electron.ipcRenderer.invoke;
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
  getCurrentTime: () => invoke(InvokeChannel.GET_CURRENT_TIME),
  runProfile: (profileId) => invoke(InvokeChannel.RUN_PROFILE, profileId),
  stopProfile: (profileId) => invoke(InvokeChannel.STOP_PROFILE, profileId),
  getSettings: () => invoke(InvokeChannel.GET_SETTINGS),
  getSettingByProfileId: (profileId) => invoke(InvokeChannel.GET_SETTING_BY_PROFILE_ID, profileId),
  saveSettings: (settings) => invoke(InvokeChannel.SAVE_SETTINGS, settings),
  openSelectFolder: () => invoke(InvokeChannel.OPEN_SELECT_FOLDER),
  syncProfile: () => invoke(InvokeChannel.SYNC_PROFILE),
  getProfilesFromJson: () => invoke(InvokeChannel.GET_PROFILES_FROM_JSON)
});
electron.contextBridge.exposeInMainWorld("sendToRenderer", (channel, data) => {
  electron.ipcRenderer.send(channel, data);
});
