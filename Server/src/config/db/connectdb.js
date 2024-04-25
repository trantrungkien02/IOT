// connectdb.js

const { createConnection } = require('mysql2/promise');
let connectionCount = 0;
async function connect() {
  try {
    const connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: '060402',
      database: 'iot',
    });

    console.log('Connected to the database');
    connectionCount++;
    console.log(connectionCount);
    return `mysql://${connection.config.user}:${connection.config.password}@${connection.config.host}/${connection.config.database}`;
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
}

module.exports = { connect };
