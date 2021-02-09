module.exports = (sequelize, Sequelize) =>{
    return sequelize.define('users', {
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
  
        name:{
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    },{
        timestamps: true,
        freezeTableName: true,
    })
};