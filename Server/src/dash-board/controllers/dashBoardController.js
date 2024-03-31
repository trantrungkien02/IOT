const dataSensor = require('../../data-sensor/models/dataSensor');
const Sequelize = require('sequelize');

class dashBoardController {
  async getAll(req, res, next) {
    try {
      const { page, pageSize, orderBy } = req.query;
      const pageNumber = parseInt(page) || 1;
      const sizePerPage = parseInt(pageSize) || 10;
      const offset = (pageNumber - 1) * sizePerPage;

      let order = [];
      if (orderBy) {
        switch (orderBy) {
          case 'id_DESC':
            order = [['id', 'DESC']];
            break;
          case 'temperature_ASC':
            order = [['temperature', 'ASC']];
            break;
          case 'temperature_DESC':
            order = [['temperature', 'DESC']];
            break;
          case 'humidity_ASC':
            order = [['humidity', 'ASC']];
            break;
          case 'humidity_DESC':
            order = [['humidity', 'DESC']];
            break;
          case 'light_ASC':
            order = [['light', 'ASC']];
            break;
          case 'light_DESC':
            order = [['light', 'DESC']];
            break;
          default:
            break;
        }
      } else {
        order = [['id', 'ASC']];
      }

      const SensorData = await dataSensor();
      const sensorData = await SensorData.findAll({
        attributes: ['id', 'temperature', 'humidity', 'light'],
        order: order,
        limit: sizePerPage,
        offset: offset,
      });

      res.send(sensorData);
    } catch (error) {
      next(error);
    }
  }

  async getByValue(req, res, next) {
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
          ],
        };
      }

      const limit = pageSize ? parseInt(pageSize) : 10;
      const offset = page ? (parseInt(page) - 1) * limit : 0; 

      const SensorData = await dataSensor();
      const sensorData = await SensorData.findAll({
        attributes: ['id', 'temperature', 'humidity', 'light'],
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
}
module.exports = new dashBoardController();
