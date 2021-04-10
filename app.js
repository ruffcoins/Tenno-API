const express = require('express');
const Sequilize = require('sequelize');
const bodyParser = require('body-parser');


const authenticationRouter = require('./src/routes/authentication_route');
const ownerRoute = require('./src/routes/owners/owner_route');
const propertyRoute = require('./src/routes/properties/property_route');
const tenantRoute = require('./src/routes/tenants/tenant_route');
const dashboardRoute = require('./src/routes/dashboard/dashboard_route');
const settingsRoute = require('./src/routes/settings/settings_route');
const notificationsRoute = require('./src/routes/notifications/notifications_route');



require('./src/db/sequilize');
const db = require('./src/db/sequilize');
const { request } = require('express');

const app = express();



app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(authenticationRouter);
app.use(ownerRoute);
app.use(propertyRoute);
app.use(tenantRoute);
app.use(dashboardRoute);
app.use(settingsRoute);
app.use(notificationsRoute);

//CronJobs
// notificationsCron.oneMonthToExpiryDate();
// loanCron.checkDailyInterest();

module.exports = app;