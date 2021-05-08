module.exports = (sequelize, Sequelize) => {
    return sequelize.define('tenants', {
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
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: { msg: "phone_number is required" },
            },
        },
        occupation: {
            type: Sequelize.STRING
        },
        marital_status: {
            type: Sequelize.STRING
        },
        sex: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        state_of_origin: {
            type: Sequelize.STRING
        },
        town: {
            type: Sequelize.STRING
        },
        lga: {
            type: Sequelize.STRING
        },
        nok_first_name: {
            type: Sequelize.STRING
        },
        nok_last_name: {
            type: Sequelize.STRING
        },
        nok_phone_number: {
            type: Sequelize.STRING
        },
        nok_email: {
            type: Sequelize.STRING
        },
        nok_address: {
            type: Sequelize.STRING
        },
        nok_relationship: {
            type: Sequelize.STRING
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        timestamps: true,
        freezeTableName: true,
    })
};