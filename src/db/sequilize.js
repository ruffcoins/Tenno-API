const Sequelize = require('sequelize');

const sequelize = new Sequelize("tenno", "root", "", {
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


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/users')(sequelize, Sequelize);
db.owner = require('../models/owners')(sequelize, Sequelize);
db.properties = require('../models/properties')(sequelize, Sequelize);
db.rooms = require('../models/rooms')(sequelize, Sequelize);
db.tenant = require('../models/tenants')(sequelize, Sequelize);



// database relationships
db.owner.hasMany(db.properties, { onDelete: 'cascade' });
db.properties.belongsTo(db.owner, {foreignKey: 'owner_id', onDelete: 'cascade'});
db.rooms.belongsTo(db.properties, {foreignKey: 'property_id', onDelete: 'cascade'});
db.tenant.hasOne(db.rooms, {foreignKey: 'tenant_id'});


 db.sequelize.sync();
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