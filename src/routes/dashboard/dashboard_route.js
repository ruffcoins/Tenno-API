const express = require('express');
const router = express.Router();
const {
    dashboard
    
} = require('../../controllers/dashboard/dashboard_controller');


router.get('/api/tenno/dashboard', dashboard );


module.exports = router;

