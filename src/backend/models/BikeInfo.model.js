const mongoose = require('mongoose');

const BikeInfo_Schema = new mongoose.Schema({
    B_Name: {
        type: String,
        required: true,
    },
    B_Type: {
        type: String,
        required: true,
    },
    B_RentingPrice: {
        type: Number,
        required: true,
    },
    B_BikeNumber: {
        type: String,
        required: true,
    },
    B_Description: {
        type: String
    },
    B_ImageUrl: {
        type: String,
        required: true,
    },
    isRented: {
        type: Boolean,
        required: false,
    },
    isReserved: {
        type: Boolean,
        required: false,
    }
});

const Bike_Info = mongoose.model('Bike_Info', BikeInfo_Schema);

module.exports = Bike_Info;