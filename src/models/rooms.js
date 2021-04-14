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
        },
        tenant_id: {
            type: Sequelize.BIGINT(20),
        },
        room_type: {
            type: Sequelize.STRING
        },
        room_name: {
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
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
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