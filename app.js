const express = require('express');
const Sequilize = require('sequelize');
const bodyParser = require('body-parser');


const authenticationRouter = require('./src/routes/authentication_route');
const createOwner = require('./src/routes/owners/owner_route');
const showOwner = require('./src/routes/owners/owner_route');
const updateOwner = require('./src/routes/owners/owner_route');
const deleteOwner = require('./src/routes/owners/owner_route');
const createProperty = require('./src/routes/properties/property_route');


require('./src/db/sequilize');
const db = require('./src/db/sequilize');
// const { deleteOwner } = require('./src/controllers/owners/owner_controller');
// const { updateOwner } = require('./src/controllers/owners/owner_controller');


const app = express();

app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(authenticationRouter);
app.use(createOwner);
app.use(showOwner);
app.use(updateOwner);
app.use(deleteOwner);
app.use(createProperty);

module.exports = app;