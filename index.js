const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// const db = require('./database/dbConfig');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());

server.listen(5000, () => console.log('App is running on port 5000'));
