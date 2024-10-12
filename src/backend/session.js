const { session } = require('electron');
const ses = session.defaultSession;

module.exports = {
  setSession: (key, value) => {
    ses.cookies.set({
      url: 'http://localhost:5000',
      name: key,
      value: value,
    });
  },

  getSession: (key) => {
    return new Promise((resolve, reject) => {
      ses.cookies.get({ url: 'http://localhost:5000', name: key }, (error, cookies) => {
        if (error) {
          reject(error);
        } else {
          resolve(cookies);
        }
      });
    });
  },

  deleteSession: (key) => {
    return new Promise((resolve, reject) => {
      ses.cookies.remove('http://localhost:5000', key, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },
};