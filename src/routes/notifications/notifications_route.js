const express = require('express');
const router = express.Router();
const {
    createNotification, getAllNotifications, updateNotification, showAllCompletedNotifications, showIncompleteNotifications
    
} = require('../../controllers/notifications/notifications_controller');


router.get('/api/tenno/notifications/completed', showAllCompletedNotifications);
router.get('/api/tenno/notifications/incomplete', showIncompleteNotifications);
router.put('/api/tenno/notifications/update/:id', updateNotification);
// router.get('/api/tenno/notifications/create', createNotification);
router.get('/api/tenno/notifications/showAll', getAllNotifications);

module.exports = router;

