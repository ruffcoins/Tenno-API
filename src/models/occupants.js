module.exports = (sequelize, Sequelize) =>{
    return sequelize.define('occupants', {
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
        firstName:{
            field: 'first_name',
            type: Sequelize.STRING
        },
        lastName: {
            field: 'last_name',
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        occupation: {
            type: Sequelize.STRING
        },
        maritalStatus: {
            field: 'marital_status',
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