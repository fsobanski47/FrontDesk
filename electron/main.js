const { app, BrowserWindow } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

let backendProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, '../frontend/build/index.html'));
}

app.whenReady().then(() => {
  // Uruchom backend jako proces .exe
  const backendPath = path.join(__dirname, '../backend/dist/start_backend.exe');
  backendProcess = execFile(backendPath, (err) => {
    if (err) console.error('Backend error:', err);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});