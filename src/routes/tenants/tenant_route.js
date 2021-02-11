const express = require('express');
const router = express.Router();
const {
    createTenant,
    showRoom,
    updateTenant
} = require('../../controllers/tenants/tenant_controller');


router.post('/api/tenno/tenant/create', createTenant);
router.get('/api/tenno/tenant/room/show/:id', showRoom);
router.get('/api/tenno/tenant/update/:id', updateTenant);

// router.delete('/api/tenno/properties/delete/:id', deleteProperty);

module.exports = router;

