const dataSensor = require('../models/dataSensor');
const Sequelize = require('sequelize');
class dataSensorController {
  // [GET] /
  async getAll(req, res, next) {
    try {
        const { page, pageSize, orderBy, filterBy } = req.query;
        const pageNumber = parseInt(page) || 1;
        const sizePerPage = parseInt(pageSize) || 10;
        let orderCriteria = [];
        let attributes = ['id', 'temperature', 'humidity', 'light', 'createdAt'];

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
            case 'dataCount_ASC':
                orderCriteria = Sequelize.literal('data_count ASC');
                break;
            case 'dataCount_DESC':
                orderCriteria = Sequelize.literal('data_count DESC');
                break;
        }

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

        // Chuyển kết quả từ Sequelize thành mảng JavaScript
        sensorData = sensorData.map(data => data.toJSON());

        // Sắp xếp mảng dữ liệu
        sensorData.sort((a, b) => {
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
            } else if (orderBy === 'light_DESC') {
                return b.light - a.light;
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
