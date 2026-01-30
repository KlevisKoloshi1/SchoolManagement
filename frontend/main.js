import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const iconPath = path.join(__dirname, "icon.png");
  console.log("Icon path:", iconPath);
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    // Set your custom app icon using absolute path
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  // Set app icon for Windows taskbar
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.yourcompany.yourapp');
  }
  createWindow();
});
