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
server.listen(5000, () => console.log('App is running on port 5000'));
