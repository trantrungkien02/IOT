const dataSensor = require('../models/dataSensorDust');
const Sequelize = require('sequelize');
const mqtt = require('mqtt');
const dayjs = require('dayjs');
const { DateTime } = require('luxon');

function convertDbTimeToAppTime(dbTime) {
  return DateTime.fromJSDate(dbTime, { zone: 'UTC' }).setZone('Asia/Ho_Chi_Minh');
}

const formatDate = inputDate => {
  // Chuyển đổi inputDate thành đối tượng dayjs
  const date = dayjs(inputDate);
  // Trả về chuỗi ngày theo định dạng YYYY-MM-DD
  return date.format('YYYY-MM-DD');
};
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
      const dust = parseInt(values[3]);

      // Ghi dữ liệu vào cơ sở dữ liệu
      const SensorData = await dataSensor();
      const newSensorData = await SensorData.create({
        temperature,
        humidity,
        light,
        dust,
      });

      // console.log('Sensor data saved:', newSensorData);
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

      let attributes = ['id', 'temperature', 'humidity', 'light', 'dust', 'createdAt'];

      if (filterBy === 'temperature') {
        attributes = attributes.filter(attr => attr !== 'humidity' && attr !== 'light' && attr !== 'dust');
      } else if (filterBy === 'humidity') {
        attributes = attributes.filter(attr => attr !== 'temperature' && attr !== 'light' && attr !== 'dust');
      } else if (filterBy === 'light') {
        attributes = attributes.filter(attr => attr !== 'temperature' && attr !== 'humidity' && attr !== 'dust');
      } else if (filterBy === 'dust') {
        attributes = attributes.filter(attr => attr !== 'temperature' && attr !== 'humidity' && attr !== 'light');
      }

      // Xác định tiêu chí sắp xếp
      let orderCriteria = [];
      if (orderBy) {
        const [field, direction] = orderBy.split('_');
        if (attributes.includes(field)) {
          orderCriteria.push([field, direction]);
        }
      }

      const SensorData = await dataSensor();
      const totalCount = await SensorData.count(); // Tính tổng số lượng dữ liệu trong toàn bộ database

      const offset = (pageNumber - 1) * sizePerPage;
      let sensorData = await SensorData.findAll({
        attributes: attributes,
        limit: sizePerPage,
        offset: offset,
        order: orderCriteria, // Thực hiện sắp xếp trên cơ sở dữ liệu
      });

      // Chuyển kết quả từ Sequelize thành mảng JavaScript và định dạng thời gian
      sensorData = sensorData.map(data => ({
        ...data.toJSON(),
        createdAt: convertDbTimeToAppTime(data.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));

      return res.send({
        totalCount: totalCount, // Tổng số lượng dữ liệu
        data: sensorData, // Dữ liệu trả về theo trang và đã sắp xếp
      });
    } catch (error) {
      next(error);
    }
  }

  async getByField(req, res, next) {
    try {
      const { field, value, page, pageSize, orderBy } = req.query;

      // Xây dựng điều kiện whereCondition
      let whereCondition = {};
      if (field !== 'all' && value) {
        whereCondition[field] = { [Sequelize.Op.substring]: value };
      } else if (field === 'all' && value) {
        whereCondition = {
          [Sequelize.Op.or]: [
            { id: { [Sequelize.Op.substring]: value } },
            { temperature: { [Sequelize.Op.substring]: value } },
            { humidity: { [Sequelize.Op.substring]: value } },
            { light: { [Sequelize.Op.substring]: value } },
            { dust: { [Sequelize.Op.substring]: value } }, // Thêm điều kiện tìm kiếm cho dust
            { createdAt: { [Sequelize.Op.substring]: value } },
          ],
        };
      }

      // console.log(whereCondition);
      const limit = pageSize ? parseInt(pageSize) : 10;
      const offset = page ? (parseInt(page) - 1) * limit : 0;

      // Xác định tiêu chí sắp xếp
      let orderCriteria = [];
      if (orderBy) {
        const [field, direction] = orderBy.split('_');
        orderCriteria.push([field, direction]);
      }

      const SensorData = await dataSensor();

      // Lấy dữ liệu theo phân trang (pagination) và sắp xếp trên cơ sở dữ liệu
      let sensorData = await SensorData.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
        order: orderCriteria, // Thực hiện sắp xếp trên cơ sở dữ liệu
      });

      if (sensorData.length === 0) {
        return res.send(`Value '${value}' was not found in the '${field} field'.`);
      }

      // Chuyển đổi sang định dạng phù hợp
      sensorData = sensorData.map(data => ({
        ...data.toJSON(),
        createdAt: convertDbTimeToAppTime(data.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));

      const totalCount = await SensorData.count({
        where: whereCondition,
      });

      return res.send({
        totalCount, // Tổng số lượng dữ liệu phù hợp với điều kiện tìm kiếm
        data: sensorData, // Dữ liệu trả về theo trang đã sắp xếp
      });
    } catch (error) {
      next(error); // Xử lý lỗi nếu có
    }
  }

  async getByCreatedAtRange(req, res, next) {
    try {
      const { page, pageSize, startDate, endDate, orderBy } = req.query;
      console.log(req.query);

      // Chuyển đổi startDate và endDate sang định dạng ngày
      let startDateTime = dayjs(startDate).startOf('day').toISOString();
      let endDateTime = dayjs(endDate).endOf('day').toISOString();

      console.log(startDateTime, endDateTime, page, pageSize, orderBy);

      // Xây dựng điều kiện whereCondition
      const whereCondition = {
        createdAt: {
          [Sequelize.Op.between]: [startDateTime, endDateTime], // Lọc dữ liệu từ startDate đến endDate
        },
      };
      console.log(whereCondition);

      const limit = pageSize ? parseInt(pageSize) : 10;
      const offset = page ? (parseInt(page) - 1) * limit : 0;

      // Xác định tiêu chí sắp xếp
      let orderCriteria = [];
      if (orderBy) {
        const [field, direction] = orderBy.split('_');
        orderCriteria.push([field, direction]);
      }

      const SensorData = await dataSensor();

      // Lấy dữ liệu theo phân trang (pagination) và sắp xếp trên cơ sở dữ liệu
      let sensorData = await SensorData.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
        order: orderCriteria,
      });

      if (sensorData.length === 0) {
        return res.send(`There is no data for the time period you selected.`);
      }

      // Chuyển đổi sang định dạng phù hợp
      sensorData = sensorData.map(data => ({
        ...data.toJSON(),
        createdAt: convertDbTimeToAppTime(data.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));

      const totalCount = await SensorData.count({
        where: whereCondition,
      });

      return res.send({
        totalCount,
        data: sensorData,
      });
    } catch (error) {
      next(error); // Xử lý lỗi nếu có
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
const mqttServer = 'mqtt://192.168.0.100'; // Địa chỉ của MQTT broker
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
