const express = require('express');
const router = express.Router();

const actionHistoryController = require('../action-history/controllers/actionHistoryController');

router.get('/actionhistory/all', actionHistoryController.getAll);
router.get('/actionhistory/search/:field', actionHistoryController.getByField);
router.post('/actionhistory/create', actionHistoryController.create);
router.put('/actionhistory/update/:id', actionHistoryController.update);
router.patch('/actionhistory/updatestatus/:id', actionHistoryController.updateStatus);
router.delete('/actionhistory/delete/:id', actionHistoryController.delete);

module.exports = router;
