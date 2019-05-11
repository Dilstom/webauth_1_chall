const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const Users = require('./users/users_model');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/api/users/:id', restricted, (req, res) => {
 Users.findById(req.params.id)
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

server.get('/api/users/', restricted, (req, res) => {
 Users.find()
  .then(saved => {
   res.status(201).json(saved);
  })
  .catch(err => {
   res.status(500).json(err);
  });
});

function restricted(req, res, next) {
 const { username, password } = req.headers;
 console.log(req.headers);
 if (username && password) {
  Users.findBy({ username })
   .first()
   .then(user => {
    // console.log('passwords: ', req.headers.password, user.password);
    if (user && bcrypt.compareSync(req.headers.password, user.password)) {
     next();
    } else {
     res.status(401).json({ message: 'You shall not pass!' });
    }
   })
   .catch(err => {
    res.status(500).json(err);
   });
 } else {
  res.status(401).json({ message: 'Please provide credentials' });
 }
}

server.listen(5000, () => console.log('App is running on port 5000'));
