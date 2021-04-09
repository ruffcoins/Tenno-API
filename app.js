const express = require('express');
const Sequilize = require('sequelize');
const bodyParser = require('body-parser');


const authenticationRouter = require('./src/routes/authentication_route');
const createOwner = require('./src/routes/owners/owner_route');
const showOwner = require('./src/routes/owners/owner_route');
const updateOwner = require('./src/routes/owners/owner_route');
const deleteOwner = require('./src/routes/owners/owner_route');
const createProperty = require('./src/routes/properties/property_route');
const showProperty = require('./src/routes/properties/property_route');
const deleteProperty = require('./src/routes/properties/property_route');
const createTenant = require('./src/routes/tenants/tenant_route');
const getAllOwners = require('./src/routes/owners/owner_route');
const getAnOwnersProperty = require('./src/routes/properties/property_route');
const getAvailablePropertyRooms = require('./src/routes/properties/property_route');
const showRoom = require('./src/routes/tenants/tenant_route');
const updateTenant = require('./src/routes/tenants/tenant_route');
const deleteTenant = require('./src/routes/tenants/tenant_route');
const dashboard = require('./src/routes/dashboard/dashboard_route');
const createOrganization = require('./src/routes/settings/settings_route');
const showAllNotifications = require('./src/routes/notifications/notifications_route')



require('./src/db/sequilize');
const db = require('./src/db/sequilize');
const { request } = require('express');


const app = express();

// const NotificationsCron = require('./src/crons/notifications_cron');


// let notificationsCron = new NotificationsCron();


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
app.use(showProperty);
app.use(deleteProperty);
app.use(createTenant);
app.use(getAllOwners);
app.use(getAnOwnersProperty);
app.use(getAvailablePropertyRooms);
app.use(showRoom);
app.use(updateTenant);
app.use(deleteTenant);
app.use(dashboard);
app.use(createOrganization);
app.use(showAllNotifications);


//CronJobs
// notificationsCron.oneMonthToExpiryDate();
// loanCron.checkDailyInterest();

module.exports = app;