const { contextBridge, ipcRenderer } = require('electron');

window.ipcRenderer = ipcRenderer;

contextBridge.exposeInMainWorld('api', {
    getData: async () => {
        try {
            const response = await ipcRenderer.invoke('get-data');
            return response;
        } catch (error) {
            console.error(error);
        }
    },
    loginData: (data) => {
        ipcRenderer.invoke('login-data', data);
    },
    submitData: (data) => {
        ipcRenderer.invoke('submit-data', data);
    },
    sendEmail: (emailTo, myOtp, emailHTML) => {
        ipcRenderer.invoke('send-email', emailTo, myOtp, emailHTML);
    },
    uploadFile: async (fileData) => {
        return await ipcRenderer.invoke('upload-file', fileData);
    }
});

ipcRenderer.on('submit-data-response', (event, response) => {
    // Forward the response to the renderer.js file
    window.dispatchEvent(new CustomEvent('submit-data-response', { detail: response }));
});

ipcRenderer.on('account-found', (event, response) => {
    window.dispatchEvent(new CustomEvent('account-found', { detail: response }));
});



