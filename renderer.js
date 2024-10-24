const { ipcRenderer } = require('electron');

document.getElementById('downloadBtn').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value;
  const savePath = document.getElementById('savePathInput').value;
  
  ipcRenderer.send('download-video', { url, savePath });
});

document.getElementById('browseBtn').addEventListener('click', () => {
  ipcRenderer.send('open-dialog');
});

ipcRenderer.on('selected-directory', (event, path) => {
  document.getElementById('savePathInput').value = path;
});

ipcRenderer.on('download-complete', (event, message) => {
  alert(message);
});

ipcRenderer.on('download-error', (event, errorMessage) => {
  alert(`Erro: ${errorMessage}`);
});
