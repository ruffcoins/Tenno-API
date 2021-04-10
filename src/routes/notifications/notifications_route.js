const express = require('express');
const router = express.Router();
const {
    showAllNotifications, updateNotification
    
} = require('../../controllers/notifications/notifications_controller');


router.get('/api/tenno/notifications/showAll', showAllNotifications);
router.put('/api/tenno/notifications/update/:id', updateNotification);

module.exports = router;

