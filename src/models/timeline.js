module.exports = (sequelize, Sequelize) => {
    return sequelize.define('timeline', {
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
        timeline: {
            type: Sequelize.STRING,
            unique: true
        }
    }, {
        timestamps: true,
        freezeTableName: true,
    })
};