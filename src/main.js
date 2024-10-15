const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const axios = require('axios');
const nodemailer = require('nodemailer');


require('./backend/server');
require('dotenv').config();
const { updateElectronApp } = require('update-electron-app')
updateElectronApp();

const PORT = process.env.PORT;
require('electron-reloader')(module);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    title: 'RBMS',
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle('login-data', async (event, data) => {
  try {
    const existingAccountResponse = await axios.post(`http://localhost:${PORT}/findUser`, data);
    if (existingAccountResponse.data.exists) {
      event.sender.send('account-found', {
        Sname: existingAccountResponse.data.SName,
        SAdmin: existingAccountResponse.data.isSuperAdmin,
        SId: existingAccountResponse.data.myId,
        success: true,
        message: 'Logged In',
      });
      return;
    }else {
      event.sender.send('account-found', {
        success: false,
        error: 'Account not found',
      });
      return;
    }
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('submit-data', async (event, data) => {
  try {
    // Check if account exists before creating a new one
    const existingAccountResponse = await axios.post(`http://localhost:${PORT}/findUser`, data);
    if (existingAccountResponse.data.exists) {
      event.sender.send('submit-data-response', {
        success: false,
        error: 'Username or Email already exists',
      });
      return;
    }

    
    // Create a new account if it doesn't exist
    const createAccountResponse = await axios.post(`http://localhost:${PORT}/createUser`, data);
    
    event.sender.send('submit-data-response', {
      success: true,
      message: 'Account created successfully',
    });
  } catch (error) {
    event.sender.send('submit-data-response', {
      success: false,
      error: 'Error creating account',
    });
  }
});


ipcMain.handle('send-email', (event, emailTo, sendOTP, emailHTML) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.emailHost,
    port: process.env.emailPort,
    secure: false,
    auth: {
      user: process.env.emailUser,
      pass: process.env.emailPass,
    },
  });

  // Define the email options
  var mailOptions = {
    from: 'RBMS Labanos Team <rbms.labanos2024@gmail.com>',
    to: emailTo,
    subject: 'RBMS OTP REQUEST',
    html: emailHTML,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    } 
  });
});
