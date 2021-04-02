const express = require('express');
const router = express.Router();
const {
    createTenant,
    showRoom,
    updateTenant,
    deleteTenant,
    getAllTenants
} = require('../../controllers/tenants/tenant_controller');


router.post('/api/tenno/tenant/create', createTenant);
router.get('/api/tenno/tenant/room/show/:id', showRoom);
router.put('/api/tenno/tenant/update/:id', updateTenant);
router.delete('/api/tenno/tenant/delete/:id', deleteTenant);
router.get('/api/tenno/tenant/getAllTenants', getAllTenants);

// router.delete('/api/tenno/properties/delete/:id', deleteProperty);

module.exports = router;

