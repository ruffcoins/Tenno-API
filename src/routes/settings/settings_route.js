const express = require('express');
const router = express.Router();
const {
    createOrganization,
    updateOrganization,
    showOrganization
} = require('../../controllers/settings/settings_controller');


router.post('/api/tenno/settings/create', createOrganization);
router.get('/api/tenno/settings/show/:id', showOrganization);
router.put('/api/tenno/settings/update/:id', updateOrganization);

module.exports = router;

