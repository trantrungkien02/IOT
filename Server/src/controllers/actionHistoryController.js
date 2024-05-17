const actionHistoryModel = require('../models/actionHistory');
const Sequelize = require('sequelize');
const moment = require('moment-timezone');
const mqtt = require('mqtt');
const { DateTime } = require('luxon');
const client = require('../config/mqttConnect/mqttClient');
const { getGeneralAction } = require('../generalmethods/getGeneralAction');
function convertDbTimeToAppTime(dbTime) {
  return DateTime.fromJSDate(dbTime, { zone: 'UTC' }).setZone('Asia/Ho_Chi_Minh');
}

class actionHistoryController {
  async getAll(req, res, next) {
    try {
      const { page, pageSize, orderBy, filterBy } = req.query;
      const pageNumber = parseInt(page) || 1;
      const sizePerPage = parseInt(pageSize) || 10;
      let orderCriteria = [];
      let attributes = ['id', 'deviceName', 'action', 'createdAt'];

      // switch (orderBy) {
      //   case 'id_ASC':
      //     orderCriteria = [['id', 'ASC']];
      //     break;
      //   case 'id_DESC':
      //     orderCriteria = [['id', 'DESC']];
      //     break;
      //   case 'deviceName_ASC':
      //     orderCriteria = [['deviceName', 'ASC']];
      //     break;
      //   case 'deviceName_DESC':
      //     orderCriteria = [['deviceName', 'DESC']];
      //     break;
      //   case 'action_ASC':
      //     orderCriteria = [['action', 'ASC']];
      //     break;
      //   case 'action_DESC':
      //     orderCriteria = [['action', 'DESC']];
      //     break;
      //   case 'createdAt_ASC':
      //     orderCriteria = [['createdAt', 'ASC']];
      //     break;
      //   case 'createdAt_DESC':
      //     orderCriteria = [['createdAt', 'DESC']];
      //     break;
      // }

      if (filterBy === 'deviceName') {
        attributes = attributes.filter(attr => attr !== 'action');
      } else if (filterBy === 'action') {
        attributes = attributes.filter(attr => attr !== 'deviceName');
      } else if (filterBy === 'createdAt') {
        attributes = attributes.filter(attr => attr !== 'deviceName' && attr !== 'action');
      }

      const ActionHistory = await actionHistoryModel();
      const totalCount = await ActionHistory.count(); // Tính tổng số lượng dữ liệu trong toàn bộ database

      const offset = (pageNumber - 1) * sizePerPage;
      let actionHistory = await ActionHistory.findAll({
        attributes: attributes,
        limit: sizePerPage,
        offset: offset,
      });

      // Chuyển kết quả từ Sequelize thành mảng JavaScript
      actionHistory = actionHistory.map(action => ({
        ...action.toJSON(),
        createdAt: convertDbTimeToAppTime(action.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));

      // Sắp xếp mảng dữ liệu
      actionHistory.sort((a, b) => {
        // Thực hiện sắp xếp theo tiêu chí được chỉ định trong orderBy
        // Đảm bảo rằng orderBy đã được xử lý ở trước để đảm bảo tính chính xác
        if (orderBy === 'id_ASC') {
          return a.id - b.id;
        } else if (orderBy === 'id_DESC') {
          return b.id - a.id;
        } else if (orderBy === 'deviceName_ASC') {
          return a.deviceName.localeCompare(b.deviceName);
        } else if (orderBy === 'deviceName_DESC') {
          return b.deviceName.localeCompare(a.deviceName);
        } else if (orderBy === 'action_ASC') {
          return a.action.localeCompare(b.action);
        } else if (orderBy === 'action_DESC') {
          return b.action.localeCompare(a.action);
        } else if (orderBy === 'createdAt_ASC') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (orderBy === 'createdAt_DESC') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          // Nếu không có orderBy nào khớp, giữ nguyên thứ tự
          return 0;
        }
      });

      res.send({
        totalCount: totalCount, // Tổng số lượng dữ liệu
        data: actionHistory, // Dữ liệu trả về theo trang và đã sắp xếp
      });
    } catch (error) {
      next(error);
    }
  }

  async getByField(req, res, next) {
    try {
      const { field, value, page, pageSize, orderBy } = req.query;

      // Điều kiện tìm kiếm dựa trên field và value
      let whereCondition = {};
      if (field !== 'all' && value) {
        const validFields = ['id', 'deviceName', 'action', 'createdAt'];
        if (!validFields.includes(field)) {
          return res.status(400).send(`Field '${field}' is not valid.`);
        }
        whereCondition[field] = { [Sequelize.Op.substring]: value };
      } else if (field === 'all' && value) {
        whereCondition = {
          [Sequelize.Op.or]: [
            { id: { [Sequelize.Op.substring]: value } },
            { deviceName: { [Sequelize.Op.substring]: value } },
            { action: { [Sequelize.Op.substring]: value } },
            { createdAt: { [Sequelize.Op.substring]: value } },
          ],
        };
      }

      const limit = pageSize ? parseInt(pageSize) : 10;
      const offset = page ? (parseInt(page) - 1) * limit : 0;

      const ActionHistory = await actionHistoryModel();

      // Lấy dữ liệu theo điều kiện phân trang
      let actionHistoryData = await ActionHistory.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
      });

      if (actionHistoryData.length === 0) {
        return res.status(404).send(`No data found for the provided field and value.`);
      }

      // Chuyển đổi sang định dạng JSON và chuyển đổi thời gian
      actionHistoryData = actionHistoryData.map(data => ({
        ...data.toJSON(),
        createdAt: convertDbTimeToAppTime(data.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));

      // Sắp xếp trong phạm vi trang hiện tại
      actionHistoryData.sort((a, b) => {
        const createdAtA = DateTime.fromISO(a.createdAt);
        const createdAtB = DateTime.fromISO(b.createdAt);

        switch (orderBy) {
          case 'id_ASC':
            return a.id - b.id;
          case 'id_DESC':
            return b.id - a.id;
          case 'deviceName_ASC':
            return a.deviceName.localeCompare(b.deviceName);
          case 'deviceName_DESC':
            return b.deviceName.localeCompare(a.deviceName);
          case 'action_ASC':
            return a.action - b.action;
          case 'action_DESC':
            return b.action - a.action;
          case 'createdAt_ASC':
            return createdAtA - createdAtB;
          case 'createdAt_DESC':
            return createdAtB - createdAtA;
          default:
            return 0;
        }
      });

      // Đếm tổng số lượng dữ liệu phù hợp với điều kiện tìm kiếm
      const totalCount = await ActionHistory.count({
        where: whereCondition,
      });

      res.send({
        totalCount, // Tổng số lượng dữ liệu phù hợp với điều kiện tìm kiếm
        data: actionHistoryData, // Dữ liệu trả về theo trang và đã sắp xếp
      });
    } catch (error) {
      next(error); // Xử lý lỗi nếu có
    }
  }

  async create(req, res, next) {
    try {
      const { deviceName, action } = req.body;

      const generalAction = getGeneralAction(action);
      // Tạo ActionHistory mới
      const ActionHistory = await actionHistoryModel();
      const newActionHistory = await ActionHistory.create({
        deviceName,
        action: generalAction,
      });

      // Xuất bản tới MQTT
      const topic = `device/led`; // Chủ đề MQTT
      const message = action; // Nội dung tin nhắn là hành động

      client.publish(topic, message, publishError => {
        if (publishError) {
          console.error('Error publishing to MQTT:', publishError);
          res.status(500).json({ error: 'Failed to publish to MQTT' });
        } else {
          console.log(`Published to MQTT topic ${topic}: ${message}`);

          // Đăng ký chủ đề 'device/led/status' để lắng nghe phản hồi
          client.subscribe('device/led/status', subscribeError => {
            if (subscribeError) {
              console.error('Error subscribing to MQTT:', subscribeError);
              res.status(500).json({ error: 'Failed to subscribe to MQTT' });
            } else {
              console.log('Subscribed to MQTT topic device/led/status');

              // Lắng nghe tin nhắn từ 'device/led/status'
              client.once('message', (receivedTopic, receivedMessage) => {
                if (receivedTopic === 'device/led/status') {
                  const receivedText = receivedMessage.toString();
                  console.log(`Received MQTT message from ${receivedTopic}:`, receivedText);

                  // Gửi phản hồi HTTP với nội dung từ MQTT
                  res.status(200).json({
                    actionHistory: newActionHistory,
                    mqttMessage: receivedText,
                  });
                }
              });
            }
          });
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { deviceName, action } = req.body;

      const ActionHistory = await actionHistoryModel();
      const existingActionHistory = await ActionHistory.findByPk(id);
      if (!existingActionHistory) {
        return res.status(404).json({ error: 'Action history not found' });
      }

      existingActionHistory.deviceName = deviceName;
      existingActionHistory.action = action;
      await existingActionHistory.save();

      res.json(existingActionHistory);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { action } = req.body;

      const ActionHistory = await actionHistoryModel();
      const existingActionHistory = await ActionHistory.findByPk(id);
      if (!existingActionHistory) {
        return res.status(404).json({ error: 'Action history not found' });
      }

      if (action !== 'on' && action !== 'off') {
        return res.status(400).json({ error: 'Invalid action value. Action must be off or on' });
      }

      existingActionHistory.action = action;
      await existingActionHistory.save();

      let responseMessage = '';
      if (action === 'on') {
        responseMessage = `Device status id ${id} is on`;
      } else {
        responseMessage = `Device status ${id} is off`;
      }

      res.json({ message: responseMessage });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const ActionHistory = await actionHistoryModel();
      const existingActionHistory = await ActionHistory.findByPk(id);
      if (!existingActionHistory) {
        return res.status(404).json({ error: 'Action history not found' });
      }

      await existingActionHistory.destroy();

      res.json({ message: 'Action history deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
// const mqttServer = 'mqtt://192.168.0.102'; // Địa chỉ của MQTT broker
// const mqttOptions = {
//   port: 1993,
//   username: 'kienok', // Tên người dùng MQTT
//   password: 'kienok', // Mật khẩu MQTT
// };
// const client = mqtt.connect(mqttServer, mqttOptions);

// client.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   client.subscribe('datasensor'); // Đăng ký subscribe vào chủ đề 'datasensor'
// });
// client.on('message', (topic, message) => {
//   console.log('Received message from topic:', topic);
//   console.log('Message:', message.toString());
//   // Xử lý dữ liệu nhận được từ MQTT
// });

// client.on('error', error => {
//   console.error('MQTT error:', error);
// });

// client.on('close', () => {
//   console.log('Disconnected from MQTT broker');
// });
module.exports = new actionHistoryController();
