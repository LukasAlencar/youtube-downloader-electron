const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const ytdl = require('youtube-dl-exec');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Evento para processar o download
ipcMain.on('download-video', (event, { url, savePath }) => {
  ytdl(url, {
    output: path.join(savePath, '%(title)s.%(ext)s'),
    format: 'best'
  })
    .then(output => event.reply('download-complete', `Download concluído: ${output}`))
    .catch(error => event.reply('download-error', error.message));
});

// Abrir a caixa de diálogo para buscar o diretório de salvamento
ipcMain.on('open-dialog', (event) => {
  const win = BrowserWindow.getFocusedWindow();
  dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      event.reply('selected-directory', result.filePaths[0]);
    }
  }).catch(err => {
    console.log(err);
  });
});
