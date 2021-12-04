module.exports = (sequelize, Sequelize) =>{
    return sequelize.define('notifications', {
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
        title:{
            type: Sequelize.STRING
        },
        body: {
            type: Sequelize.STRING
        },
        completed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    },{
        timestamps: true,
        freezeTableName: true,
    })
};