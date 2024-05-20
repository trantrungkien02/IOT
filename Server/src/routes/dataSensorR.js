const express = require('express');
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const dataSensorController = require('../controllers/dataSensorController');

router.get('/datasensor', dataSensorController.getAll);
router.get('/datasensor/search/:field', dataSensorController.getByField);
router.get('/datasensor/searchcreatedat', dataSensorController.getByCreatedAtRange);
router.put('/datasensor/update/:id', dataSensorController.update);
router.delete('/datasensor/delete/:id', dataSensorController.delete);

module.exports = router;
