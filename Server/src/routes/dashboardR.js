const express = require('express');
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const dashBoardController = require('../controllers/dashBoardController');

router.get('/dashboard', dashBoardController.getAll);
router.get('/dashboard/search/:field', dashBoardController.getByValue);

module.exports = router;
