const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('./db');
const app = express();
const Staff_Accounts = require('./models/Staff_Accounts.model');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

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
    const account = await Staff_Accounts.findOne({ $or: [{ S_Username:data.S_Username }, { S_Email: data.S_Email }] });
    

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
      S_Email: data.S_Email
    });

    await user.save();

    console.log('User created:', user);
    res.status(201).send({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).send({ message: 'Error creating user', error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}: http://localhost:${PORT}`);
});

// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const db = require('./db');
// const app = express();
// const session = require('express-session');

// app.use(cors());
// app.use(express.json());
// app.use(session({
//   secret: 'secret-key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));

// app.get('/fetchUsers', async (req, res) => {
//   try {
//     const data = await db.collection('Staff_Accounts').find().toArray();
//     res.json(data);
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).send({ message: 'Error fetching users' });
//   }
// });

// app.post('/findUser ', async (req, res) => {
//   try {
//     const data = req.body;
//     const account = await db.collection('Staff_Accounts').findOne({ S_Username: data.S_Username });
//     if (account) {
//       const isValidPassword = await bcrypt.compare(data.S_Password, account.S_Password);
//       if (isValidPassword) {
//         req.session.isLoggedIn = true;
//         req.session.username = data.S_Username;
//         res.json({ exists: true, message: 'Logged in successfully' });
//       } else {
//         res.json({ exists: false, message: 'Invalid password' });
//       }
//     } else {
//       res.json({ exists: false, message: 'User  not found' });
//     }
//   } catch (error) {
//     console.error('Error finding user:', error);
//     res.status(400).send({ message: 'Error finding user', error: error });
//   }
// });

// app.post('/createUser ', async (req, res) => {
//   try {
//     const data = req.body;
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(data.S_Password, saltRounds);

//     const user = await db.collection('Staff_Accounts').insertOne({
//       S_Username: data.S_Username,
//       S_Password: hashedPassword,
//     });

//     console.log('User  created:', user);
//     res.status(201).send({ message: 'User  created successfully' });
//   } catch (err) {
//     console.error('Error creating user:', err);
//     res.status(400).send({ message: 'Error creating user', error: err });
//   }
// });

// app.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Error logging out:', err);
//       res.status(500).send({ message: 'Error logging out' });
//     } else {
//       res.send({ message: 'Logged out successfully' });
//     }
//   });
// });

// app.listen(5000, () => {
//   console.log('Server listening on port 5000');
// });