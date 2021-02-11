module.exports = (sequelize, Sequelize) =>{
    return sequelize.define('tenants', {
        id:{
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement:true
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
        },
        first_name:{
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING,
            unique: true,
            allowNull:false,
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
    },{
        timestamps: true,
        freezeTableName: true,
    })
};