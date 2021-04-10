module.exports = (sequelize, Sequelize) => {
    return sequelize.define('notices', {
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
        title: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: true,
        freezeTableName: true,
    })
};