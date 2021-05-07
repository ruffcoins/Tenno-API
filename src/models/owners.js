module.exports = (sequelize, Sequelize) =>{
    return sequelize.define('owners', {
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
        phone: {
            type: Sequelize.STRING,
            allowNull:false,
            validate: {
                notNull: { msg: "phone is required" },
            },
            unique: true
        },
        address: {
            type: Sequelize.STRING,
        },
        occupation: {
            type: Sequelize.STRING
        },
        sex: {
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
    },{
        timestamps: true,
        freezeTableName: true,
    })
};