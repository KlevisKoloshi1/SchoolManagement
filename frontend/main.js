import { app, BrowserWindow } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    // Set your custom app icon (relative to the project folder)
    icon: "icon.ico",
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);
