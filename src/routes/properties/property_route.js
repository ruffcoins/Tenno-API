const express = require('express');
const router = express.Router();
const {
    createProperty,
    showProperty,
    deleteProperty,
    getAnOwnersProperties,
    getAvailablePropertyRooms,
    allPropertiesWithTheirOwners,
    allPropertiesWithTheirOwnersAndRooms,
    searchProperties,
    allPropertiesWithVacantRooms,
    getAllRooms
} = require('../../controllers/properties/properties_controller');


router.post('/api/tenno/properties/create', createProperty);
router.get('/api/tenno/properties/show/:id', showProperty);
router.delete('/api/tenno/properties/delete/:id', deleteProperty);
router.get('/api/tenno/properties/getOwnerProperties', getAnOwnersProperties);
router.get('/api/tenno/properties/getAvailablePropertyRooms', getAvailablePropertyRooms);
router.get('/api/tenno/properties/allPropertiesWithTheirOwners', allPropertiesWithTheirOwners);
router.get('/api/tenno/properties/allPropertiesWithTheirOwnersAndRooms', allPropertiesWithTheirOwnersAndRooms);
router.get('/api/tenno/properties/search', searchProperties);
router.get('/api/tenno/properties/allPropertiesWithVacantRooms', allPropertiesWithVacantRooms);
router.get('/api/tenno/properties/allRooms', getAllRooms);


module.exports = router;

