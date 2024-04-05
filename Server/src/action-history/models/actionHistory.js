const { Sequelize, DataTypes } = require('sequelize');
const { connect } = require('../../config/db/connectdb');

async function actionHistory() {
  try {
    const url = await connect(); 
    const sequelize = new Sequelize(url, {
      host: 'localhost',
      dialect: 'mysql',
      timezone: '+07:00',
    });

    const ActionHistoryModel = sequelize.define(
      'action_histories',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        deviceName: {
          type: DataTypes.STRING, 
          allowNull: false,
        },
        action: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
      },
      {
        timestamps: false, 
      },
    );

    return ActionHistoryModel;
  } catch (error) {
    console.error('Loi:', error);
    throw error;
  }
}

module.exports = actionHistory;
