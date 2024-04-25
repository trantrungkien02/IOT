const dataSensor = require('../models/dataSensor');
const Sequelize = require('sequelize');
const mqtt = require('mqtt');
const { DateTime } = require('luxon');

function convertDbTimeToAppTime(dbTime) {
  return DateTime.fromJSDate(dbTime, { zone: 'UTC' }).setZone('Asia/Ho_Chi_Minh');
}

class dataSensorController {
  async handleMessage(topic, message) {
    try {
      console.log('Received message from topic:', topic);
      console.log('Message:', message.toString());

      // Xử lý dữ liệu nhận được từ MQTT
      const dataString = message.toString();
      const values = dataString.split(' ');

      // Lưu các giá trị vào các biến tương ứng
      const temperature = parseFloat(values[0]);
      const humidity = parseFloat(values[1]);
      const light = parseInt(values[2]);

      // Ghi dữ liệu vào cơ sở dữ liệu
      const SensorData = await dataSensor();
      const newSensorData = await SensorData.create({
        temperature,
        humidity,
        light,
      });

      console.log('Sensor data saved:', newSensorData);
    } catch (error) {
      console.error('Error processing and saving sensor data:', error);
    }
  }
  // [GET] /
  async getAll(req, res, next) {
    try {
      const { page, pageSize, orderBy, filterBy } = req.query;
      const pageNumber = parseInt(page) || 1;
      const sizePerPage = parseInt(pageSize) || 10;

      let orderCriteria = [];
      let attributes = ['id', 'temperature', 'humidity', 'light', 'createdAt'];

      if (filterBy === 'temperature') {
        attributes = attributes.filter(attr => attr !== 'humidity' && attr !== 'light');
      } else if (filterBy === 'humidity') {
        attributes = attributes.filter(attr => attr !== 'temperature' && attr !== 'light');
      } else if (filterBy === 'light') {
        attributes = attributes.filter(attr => attr !== 'temperature' && attr !== 'humidity');
      }

      const SensorData = await dataSensor();
      const totalCount = await SensorData.count(); // Tính tổng số lượng dữ liệu trong toàn bộ database

      const offset = (pageNumber - 1) * sizePerPage;
      let sensorData = await SensorData.findAll({
        attributes: attributes,
        limit: sizePerPage,
        offset: offset,
      });
      // console.log(sensorData);
      // Chuyển kết quả từ Sequelize thành mảng JavaScript
      sensorData = sensorData.map(data => ({
        ...data.toJSON(),
        createdAt: convertDbTimeToAppTime(data.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));

      // Sắp xếp mảng dữ liệu
      sensorData.sort((a, b) => {
        const createdAtA = DateTime.fromISO(a.createdAt);
        const createdAtB = DateTime.fromISO(b.createdAt);
        // Thực hiện sắp xếp theo tiêu chí được chỉ định trong orderBy
        // Đảm bảo rằng orderBy đã được xử lý ở trước để đảm bảo tính chính xác
        if (orderBy === 'id_ASC') {
          return a.id - b.id;
        } else if (orderBy === 'id_DESC') {
          return b.id - a.id;
        } else if (orderBy === 'temperature_ASC') {
          return a.temperature - b.temperature;
        } else if (orderBy === 'temperature_DESC') {
          return b.temperature - a.temperature;
        } else if (orderBy === 'humidity_ASC') {
          return a.humidity - b.humidity;
        } else if (orderBy === 'humidity_DESC') {
          return b.humidity - a.humidity;
        } else if (orderBy === 'light_ASC') {
          return a.light - b.light;
        } else if (orderBy === 'createdAt_ASC') {
          return createdAtA - createdAtB;
        } else if (orderBy === 'createdAt_DESC') {
          return createdAtB - createdAtA;
        } else {
          // Nếu không có orderBy nào khớp, giữ nguyên thứ tự
          return 0;
        }
      });

      res.send({
        totalCount: totalCount, // Tổng số lượng dữ liệu
        data: sensorData, // Dữ liệu trả về theo trang và đã sắp xếp
      });
    } catch (error) {
      next(error);
    }
  }

  async getByField(req, res, next) {
    try {
      const { field, value, page, pageSize } = req.query;

      let whereCondition = {};

      if (field != 'all' && value) {
        whereCondition[field] = { [Sequelize.Op.substring]: value };
      } else if (field === 'all' && value) {
        whereCondition = {
          [Sequelize.Op.or]: [
            { id: { [Sequelize.Op.substring]: value } },
            { temperature: { [Sequelize.Op.substring]: value } },
            { humidity: { [Sequelize.Op.substring]: value } },
            { light: { [Sequelize.Op.substring]: value } },
            { createdAt: { [Sequelize.Op.substring]: value } },
          ],
        };
      }

      const limit = pageSize ? parseInt(pageSize) : 10;
      const offset = page ? (parseInt(page) - 1) * limit : 0;

      const SensorData = await dataSensor();
      let sensorData = await SensorData.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
      });

      if (sensorData.length === 0) {
        return res.status(404).send(`No data found for the provided value '${value}'.`);
      }
      sensorData = sensorData.map(data => ({
        ...data.toJSON(),
        createdAt: convertDbTimeToAppTime(data.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));
      res.send(sensorData);
    } catch (error) {
      next(error);
    }
  }

  // Hàm xử lý và lưu dữ liệu vào cơ sở dữ liệu

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { temperature, humidity, light } = req.body;

      const SensorData = await dataSensor();
      const existingSensorData = await SensorData.findByPk(id);
      if (!existingSensorData) {
        return res.status(404).json({ error: 'Datasensor not found' });
      }

      existingSensorData.temperature = temperature;
      existingSensorData.humidity = humidity;
      existingSensorData.light = light;
      await existingSensorData.save();

      res.json(existingSensorData);
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const SensorData = await dataSensor();
      const existingSensorData = await SensorData.findByPk(id);
      if (!existingSensorData) {
        return res.status(404).json({ error: 'Datasensor not found' });
      }

      await existingSensorData.destroy();

      res.json({ message: 'Datasensor deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
const mqttServer = 'mqtt://192.168.55.13'; // Địa chỉ của MQTT broker
const mqttOptions = {
  port: 1993,
  username: 'kienok', // Tên người dùng MQTT
  password: 'kienok', // Mật khẩu MQTT
};
const client = mqtt.connect(mqttServer, mqttOptions);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('datasensor'); // Đăng ký subscribe vào chủ đề 'datasensor'
});
client.on('message', (topic, message) => {
  console.log('Received message from topic:', topic);
  console.log('Message:', message.toString());
  // Xử lý dữ liệu nhận được từ MQTT
  const data = new dataSensorController();

  data.handleMessage(topic, message);
});

client.on('error', error => {
  console.error('MQTT error:', error);
});

client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});
module.exports = new dataSensorController();
