const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const Users = require('./users/users_model');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());

const sessionConfig = {
 name: 'donkey',
 secret: 'keep it secret',
 cookie: {
  maxAge: 1000 * 60 * 10,
  secure: false,
  httpOnly: true,
 },
 resave: false,
 saveUninitialized: false,
};

server.use(session(sessionConfig));

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
    req.session.user = user;
    // console.log(req.session.user) => // { id: 13, username: 'john8', password: '$IiudrqstEHMDbET/t1DfE3qy1EPrM1.8X2a$08$JK7dnCauj4dD.lgOlI9.' };
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
 if (req.session && req.session.user) {
     next();
    } else {
  res
   .status(401)
   .json({ message: 'You shall not pass! You are not authenticated!' });
 }
}

server.listen(5000, () => console.log('App is running on port 5000'));
