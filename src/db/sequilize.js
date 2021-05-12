const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.database, process.env.username, process.env.password, {
    host: process.env.host,
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: 60000
    },
    pool: {
        max: 5,
        min: 0,
        acquire: process.env.acquire,
        idle: 10000
    }
});

// console.log(process.env.database, process.env.username, process.env.password)
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/users')(sequelize, Sequelize);
db.owner = require('../models/owners')(sequelize, Sequelize);
db.properties = require('../models/properties')(sequelize, Sequelize);
db.rooms = require('../models/rooms')(sequelize, Sequelize);
db.tenant = require('../models/tenants')(sequelize, Sequelize);
db.settings = require('../models/settings')(sequelize, Sequelize);
db.notifications = require('../models/notifications')(sequelize, Sequelize);
db.notice = require('../models/notices')(sequelize, Sequelize);
db.timeline = require('../models/timeline')(sequelize, Sequelize);


// database relationships
db.owner.hasMany(db.properties, { onDelete: 'cascade' });
db.properties.belongsTo(db.owner);
db.properties.hasMany(db.rooms, { onDelete: 'cascade' });
db.rooms.belongsTo(db.properties);
db.tenant.hasOne(db.rooms, { foreignKey: 'tenant_id' });
db.notifications.belongsTo(db.rooms);
db.notice.belongsTo(db.notifications);


db.sequelize.sync({ force: true });
// {force:true}
db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = db;
