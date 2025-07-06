const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  executeCommand: (command, args) => ipcRenderer.invoke('execute-command', command, args),
  chat: (message) => ipcRenderer.invoke('chat', message)
});
