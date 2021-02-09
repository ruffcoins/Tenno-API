module.exports = (sequelize, Sequelize) => {
    return sequelize.define('rooms', {
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
        },propertyId: {
            field: 'property_id',
            type: Sequelize.BIGINT(20),
            allowNull: false,
            validate: {
                notNull: { msg: "property_id is required" },
            },
        },
        occupantId: {
            field: 'occupant_id',
            type: Sequelize.BIGINT(20),
        },
        roomType: {
            field: 'room_type',
            type: Sequelize.STRING
        },
        roomName: {
            field: 'room_name',
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: "room_name is required" },
            },
        },
        amount: {
            type: Sequelize.INTEGER
        },
        duration: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATE
        },
        endDate: {
            type: Sequelize.DATE
        },
        available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        timestamps: true,
        freezeTableName: true,
    })
};