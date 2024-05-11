const { createConnection } = require('mysql2/promise');
let connectionCount = 0;

async function connect() {
  let connection;
  try {
    connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: '060402',
      database: 'iot',
    });

    console.log('Connected to the database');
    connectionCount++;
    console.log('Connection count:', connectionCount);

    const connectionString = `mysql://${connection.config.user}:${connection.config.password}@${connection.config.host}/${connection.config.database}`;

    // Đảm bảo đóng kết nối ngay sau khi thực hiện công việc
    return connectionString;
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end(); // Đóng kết nối sau khi hoàn thành
    }
  }
}

module.exports = { connect };
