const express = require('express');
const router = express.Router();
const {
    showAllNotifications
    
} = require('../../controllers/notifications/notifications_controller');


router.get('/api/tenno/notifications/showAll', showAllNotifications);
// router.get('/api/tenno/owner/show/:id', showOwner);
// router.put('/api/tenno/owner/update/:id', updateOwner);
// router.delete('/api/tenno/owner/delete/:id', deleteOwner);
// router.get('/api/tenno/owner/allOwners', getAllOwners);

module.exports = router;

