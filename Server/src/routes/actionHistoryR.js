const express = require('express');
const router = express.Router();

const actionHistoryController = require('../controllers/actionHistoryController');

router.get('/actionhistory', actionHistoryController.getAll);
router.get('/actionhistory/search/:field', actionHistoryController.getByField);
router.get('/actionhistory/searchcreatedat', actionHistoryController.getByCreatedAtRange);
router.post('/actionhistory/create', actionHistoryController.create);
router.put('/actionhistory/update/:id', actionHistoryController.update);
router.patch('/actionhistory/updatestatus/:id', actionHistoryController.updateStatus);
router.delete('/actionhistory/delete/:id', actionHistoryController.delete);

module.exports = router;
