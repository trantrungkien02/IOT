const actionHistoryModel = require('../models/actionHistory');
const Sequelize = require('sequelize');
const moment = require('moment-timezone');
const mqtt = require('mqtt');
const dayjs = require('dayjs');
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

      // Xác định tiêu chí sắp xếp
      if (orderBy) {
        const [field, direction] = orderBy.split('_');
        orderCriteria.push([field, direction]);
      }

      // Lấy dữ liệu theo phân trang (pagination) và sắp xếp trên cơ sở dữ liệu
      let actionHistory = await ActionHistory.findAll({
        attributes: attributes,
        limit: sizePerPage,
        offset: offset,
        order: orderCriteria, // Thực hiện sắp xếp trên cơ sở dữ liệu
      });

      // Chuyển kết quả từ Sequelize thành mảng JavaScript và chuyển đổi thời gian của createdAt
      actionHistory = actionHistory.map(action => ({
        ...action.toJSON(),
        createdAt: convertDbTimeToAppTime(action.createdAt).toISO(),
      }));

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

      // Xây dựng điều kiện tìm kiếm dựa trên field và value
      let whereCondition = {};
      if (field !== 'all' && value) {
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

      // Xác định tiêu chí sắp xếp
      let orderCriteria = [];
      if (orderBy) {
        const [field, direction] = orderBy.split('_');
        orderCriteria.push([field, direction]);
      }

      // Lấy dữ liệu theo điều kiện tìm kiếm và sắp xếp trên cơ sở dữ liệu
      let actionHistoryData = await ActionHistory.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
        order: orderCriteria, // Áp dụng sắp xếp trên cơ sở dữ liệu
      });

      if (actionHistoryData.length === 0) {
        return res.send(`Value '${value}' was not found in the '${field} field'.`);
      }

      // Chuyển đổi sang định dạng JSON và chuyển đổi thời gian
      actionHistoryData = actionHistoryData.map(data => ({
        ...data.toJSON(),
        createdAt: convertDbTimeToAppTime(data.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));

      const totalCount = await ActionHistory.count({
        where: whereCondition,
      });

      res.send({
        totalCount, // Tổng số lượng dữ liệu phù hợp với điều kiện tìm kiếm (chưa cần lấy lại từ cơ sở dữ liệu)
        data: actionHistoryData, // Dữ liệu trả về theo trang và đã sắp xếp
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

      const ActionHistory = await actionHistoryModel();

      // Lấy dữ liệu theo phân trang (pagination) và sắp xếp trên cơ sở dữ liệu
      let actionHistory = await ActionHistory.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
        order: orderCriteria,
      });

      if (actionHistory.length === 0) {
        return res.send(`There is no data for the time period you selected.`);
      }

      // Chuyển đổi sang định dạng phù hợp
      actionHistory = actionHistory.map(data => ({
        ...data.toJSON(),
        createdAt: convertDbTimeToAppTime(data.createdAt).toISO(), // Chuyển đổi thời gian của createdAt
      }));

      const totalCount = await ActionHistory.count({
        where: whereCondition,
      });

      return res.send({
        totalCount,
        data: actionHistory,
      });
    } catch (error) {
      next(error); // Xử lý lỗi nếu có
    }
  }

  async create(req, res, next) {
    try {
      const actions = Array.isArray(req.body) ? req.body : [req.body];
      const ActionHistory = await actionHistoryModel();

      const newActionHistories = await Promise.all(
        actions.map(async actionObj => {
          const { deviceName, action } = actionObj;
          const generalAction = getGeneralAction(action);

          const newActionHistory = await ActionHistory.create({
            deviceName,
            action: generalAction,
          });

          const topic = `device/led`;
          const message = action;
          console.log(message);

          client.publish(topic, message, publishError => {
            if (publishError) {
              console.error('Error publishing to MQTT:', publishError);
            } else {
              console.log(`Published to MQTT topic ${topic}: ${message}`);
            }
          });

          return newActionHistory;
        }),
      );

      const statusTopic = 'device/led/status';
      client.subscribe(statusTopic, subscribeError => {
        if (subscribeError) {
          console.error('Error subscribing to MQTT:', subscribeError);
          return res.status(500).json({ error: 'Failed to subscribe to MQTT' });
        }

        client.once('message', (receivedTopic, receivedMessage) => {
          if (receivedTopic === statusTopic) {
            const receivedText = receivedMessage.toString();
            console.log(`Received MQTT message from ${receivedTopic}:`, receivedText);

            res.status(200).json({
              actionHistories: newActionHistories,
              mqttMessage: receivedText,
            });
          }
        });
      });
    } catch (error) {
      next(error);
    }
  }
  // async create(req, res, next) {
  //   try {
  //     const { deviceName, action } = req.body;

  //     const generalAction = getGeneralAction(action);
  //     // Tạo ActionHistory mới
  //     const ActionHistory = await actionHistoryModel();
  //     const newActionHistory = await ActionHistory.create({
  //       deviceName,
  //       action: generalAction,
  //     });

  //     // Xuất bản tới MQTT
  //     const topic = `device/led`; // Chủ đề MQTT
  //     const message = action; // Nội dung tin nhắn là hành động

  //     client.publish(topic, message, publishError => {
  //       if (publishError) {
  //         console.error('Error publishing to MQTT:', publishError);
  //         res.status(500).json({ error: 'Failed to publish to MQTT' });
  //       } else {
  //         console.log(`Published to MQTT topic ${topic}: ${message}`);

  //         // Đăng ký chủ đề 'device/led/status' để lắng nghe phản hồi
  //         client.subscribe('device/led/status', subscribeError => {
  //           if (subscribeError) {
  //             console.error('Error subscribing to MQTT:', subscribeError);
  //             res.status(500).json({ error: 'Failed to subscribe to MQTT' });
  //           } else {
  //             console.log('Subscribed to MQTT topic device/led/status');

  //             // Lắng nghe tin nhắn từ 'device/led/status'
  //             client.once('message', (receivedTopic, receivedMessage) => {
  //               if (receivedTopic === 'device/led/status') {
  //                 const receivedText = receivedMessage.toString();
  //                 console.log(`Received MQTT message from ${receivedTopic}:`, receivedText);

  //                 // Gửi phản hồi HTTP với nội dung từ MQTT
  //                 res.status(200).json({
  //                   actionHistory: newActionHistory,
  //                   mqttMessage: receivedText,
  //                 });
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

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
