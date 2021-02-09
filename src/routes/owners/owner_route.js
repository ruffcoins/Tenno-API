const express = require('express');
const router = express.Router();
const {
    createOwner,
    showOwner,
    updateOwner,
    deleteOwner
} = require('../../controllers/owners/owner_controller');


router.post('/api/tenno/owner/create', createOwner);
router.get('/api/tenno/owner/show/:id', showOwner);
router.put('/api/tenno/owner/update/:id', updateOwner);
router.delete('/api/tenno/owner/delete/:id', deleteOwner);

module.exports = router;

