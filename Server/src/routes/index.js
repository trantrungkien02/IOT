const dataSensorRouter = require('./dataSensorR');
const actionHistoryRouter = require('./actionHistoryR');
const dashBoardRouter = require('./dashboardR');
const swaggerJSDoc = require('../../swagger.json');
const swaggerUi = require('swagger-ui-express');
const dataSensorController = require('../data-sensor/controllers/dataSensorController');

function route(app) {
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));

  app.use('/', actionHistoryRouter);
  app.use('/', dataSensorRouter);
  app.use('/', dashBoardRouter);
}

module.exports = route;
