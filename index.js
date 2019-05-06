const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const Users = require('./users/users_model');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/api/users/', (req, res) => {
 Users.find()
  .then(saved => {
   res.status(201).json(saved);
  })
  .catch(err => {
   res.status(500).json(err);
  });
});

server.post('/api/register', (req, res) => {
 const user = req.body;
 const hash = bcrypt.hashSync(user.password, 8);
 user.password = hash;

 Users.add(user)
  .then(saved => {
   res.status(201).json(saved);
  })
  .catch(err => {
   res.status(500).json(err);
  });
});

server.post('/api/login', (req, res) => {
 const { username, password } = req.body;
 //  console.log({ username }); // object { username: 'Name'}
 Users.findBy({ username })
  .first()
  .then(user => {
   if (user && bcrypt.compareSync(password, user.password)) {
    res.status(200).json({ message: `Welcome ${user.username}` });
   } else {
    res.status(401).json({ message: 'Invalid Credentials' });
   }
  })
  .catch(err => {
   res.status(500).json(err);
  });
});

 Users.add(user)
  .then(saved => {
   res.status(201).json(saved);
  })
  .catch(err => {
   res.status(500).json(err);
  });
});

server.listen(5000, () => console.log('App is running on port 5000'));
