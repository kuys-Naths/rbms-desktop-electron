const mongoose = require('mongoose');

const Staff_Accounts_Schema = new mongoose.Schema({
    S_Username: {
        type: String,
        required: true,
    },
    S_Password: {
        type: String,
        required: true,
    },
    S_Email: {
        type: String,
        required: true,
    },
});

const Staff_Accounts = mongoose.model('Staff_Accounts', Staff_Accounts_Schema);

module.exports = Staff_Accounts;