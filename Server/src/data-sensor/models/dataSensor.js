const { Sequelize, DataTypes } = require('sequelize');
const { connect } = require('../../config/db/connectdb');

async function dataSensor() {
  try {
    const url = await connect();
    const sequelize = new Sequelize(url, {
      host: 'localhost',
      dialect: 'mysql',
      timezone: '+07:00',
    });
    // console.log(sequelize);

    const SensorData = sequelize.define(
      'data_sensors',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        temperature: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        humidity: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        light: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        timestamps: false,
      },
    );

    // console.log(SensorData);
    return SensorData;
  } catch (error) {
    console.error('Loi:', error);
    throw error;
  }
}

module.exports = dataSensor;
