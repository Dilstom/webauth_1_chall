const db = require('../database/dbConfig');

module.exports = {
 add,
 findById,
 find,
};

function find() {
 return db('users');
}
function findById(id) {
 return db('users')
  .where({ id })
  .first();
}

async function add(user) {
 const [id] = await db('users').insert(user);
 return findById(id);
}
