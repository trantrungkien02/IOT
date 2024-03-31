const dataSensor = require('../models/dataSensor');
const Sequelize = require('sequelize');
class dataSensorController {
  // [GET] /
  async getAll(req, res, next) {
    try {
      const { page, pageSize, orderBy } = req.query;
      const pageNumber = parseInt(page) || 1;
      const sizePerPage = parseInt(pageSize) || 10;
      let orderCriteria = [];

      switch (orderBy) {
        case 'id_ASC':
          orderCriteria = [['id', 'ASC']];
          break;
        case 'id_DESC':
          orderCriteria = [['id', 'DESC']];
          break;
        case 'temperature_ASC':
          orderCriteria = [['temperature', 'ASC']];
          break;
        case 'temperature_DESC':
          orderCriteria = [['temperature', 'DESC']];
          break;
        case 'humidity_ASC':
          orderCriteria = [['humidity', 'ASC']];
          break;
        case 'humidity_DESC':
          orderCriteria = [['humidity', 'DESC']];
          break;
        case 'light_ASC':
          orderCriteria = [['light', 'ASC']];
          break;
        case 'light_DESC':
          orderCriteria = [['light', 'DESC']];
          break;
      }

      const SensorData = await dataSensor();
      const sensorData = await SensorData.findAll({
        limit: sizePerPage,
        offset: (pageNumber - 1) * sizePerPage,
        order: orderCriteria,
      });

      res.send(sensorData);
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
      const sensorData = await SensorData.findAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
      });

      if (sensorData.length === 0) {
        return res.status(404).send(`No data found for the provided value '${value}'.`);
      }

      res.send(sensorData);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const SensorData = await dataSensor();
      const { temperature, humidity, light } = req.body;
      console.log(req.body);
      const newSensorData = await SensorData.create({
        temperature,
        humidity,
        light,
      });

      res.status(201).json(newSensorData);
    } catch (error) {
      next(error);
    }
  }

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

module.exports = new dataSensorController();
