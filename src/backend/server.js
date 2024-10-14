const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

require('./db');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

const app = express();
const Staff_Accounts = require('./models/Staff_Accounts.model');
const Bike_Info = require('./models/BikeInfo.model');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

// ADMINACCOUNT
app.get('/fetchUsers', async (req, res) => {
    try {
        const data = await Staff_Accounts.find().exec();
        res.json(data);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send({ message: 'Error fetching users' });
    }
});

app.post('/findUser', async (req, res) => {
    try {
        const data = req.body;
        // Check if account exists in your database
        // const account = await db.collection('Staff_Accounts').findOne({ $and: [{ S_Username:data.S_Username }, { S_Password:data.S_Password }] });
        const account = await Staff_Accounts.findOne({
            $or: [{ S_Username: data.S_Username }, { S_Email: data.S_Email }],
        });

        if (account) {
            const isValidPassword = await bcrypt.compare(data.S_Password, account.S_Password);
            if (isValidPassword || data.S_Email === account.S_Email) {
                res.json({ exists: true });
            } else {
                res.json({ exists: false });
            }
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(400).send({ message: 'Error finding user', error: error });
    }
});

app.post('/createUser', async (req, res) => {
    try {
        const data = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.S_Password, saltRounds);

        const user = Staff_Accounts({
            S_Username: data.S_Username,
            S_Password: hashedPassword,
            S_Email: data.S_Email,
        });

        await user.save();

        console.log('User created:', user);
        res.status(201).send({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(400).send({ message: 'Error creating user', error: err });
    }
});


//cloudinary
const upload = multer({ dest: './uploads/' });

app.post('/upload-image', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'bikeImages',
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(400).send({ message: 'Error uploading image', error: err });
  }
});
app.post('/uploadBike', async (req, res) => {
    try {
        const data = req.body;
        const newBike = new Bike_Info({
            B_Name: data.B_Name,
            B_Type: data.B_Type,
            B_RentingPrice: data.B_RentingPrice,
            B_BikeNumber: data.B_BikeNumber,
            B_Description: data.B_Description,
            B_ImageUrl: data.B_ImageUrl,
        });
        await newBike.save();

        res.status(201).send({ message: 'Bike uploaded.' });
    } catch (err) {
        console.error('Error uploading bike:', err);
        res.status(400).send({ message: 'Error uploading bike', error: err });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}: http://localhost:${PORT}`);
});
