const actionHistoryModel = require('../models/actionHistory');
const Sequelize = require('sequelize');
const moment = require('moment-timezone');
const { DateTime } = require('luxon');
class actionHistoryController {
  async getAll(req, res, next) {
    try {
      const { page, pageSize, orderBy } = req.query;
      const pageNumber = parseInt(page) || 1;
      const sizePerPage = parseInt(pageSize) || 10;
      let orderCriteria = [];

      switch (orderBy) {
        case 'id_DESC':
          orderCriteria = [['id', 'DESC']];
          break;
        case 'deviceName_ASC':
          orderCriteria = [['deviceName', 'ASC']];
          break;
        case 'deviceName_DESC':
          orderCriteria = [['deviceName', 'DESC']];
          break;
        case 'action_ASC':
          orderCriteria = [['action', 'ASC']];
          break;
        case 'action_DESC':
          orderCriteria = [['action', 'DESC']];
          break;
        case 'createdAt_ASC':
          orderCriteria = [['createdAt', 'ASC']];
          break;
        case 'createdAt_DESC':
          orderCriteria = [['createdAt', 'DESC']];
          break;
        default:
          orderCriteria = [['id', 'ASC']];
          break;
      }

      const ActionHistory = await actionHistoryModel();
      const actionHistory = await ActionHistory.findAll({
        limit: sizePerPage,
        offset: (pageNumber - 1) * sizePerPage,
        order: orderCriteria,
      });

      res.send(actionHistory);
    } catch (error) {
      next(error);
    }
  }

  async getByField(req, res, next) {
    try {
      const { field, value, page, pageSize } = req.query;

      let whereCondition = {};

      if (field != 'all' && value) {
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
      const actionHistoryData = await ActionHistory.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
      });

      res.send(actionHistoryData);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { deviceName, action } = req.body;
      const currentTime = DateTime.now();

      console.log(currentTime.toISO());
      const ActionHistory = await actionHistoryModel();
      const newActionHistory = await ActionHistory.create({
        deviceName,
        action, 
      });

      res.status(201).json(newActionHistory);
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

module.exports = new actionHistoryController();
