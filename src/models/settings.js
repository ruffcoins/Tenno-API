module.exports = (sequelize, Sequelize) => {
    return sequelize.define('settings', {
        id: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
        },
        organization_name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
    }, {
        timestamps: true,
        freezeTableName: true,
    })
};