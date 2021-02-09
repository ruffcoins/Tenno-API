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
        }
    },{
        timestamps: true,
        freezeTableName: true,
    })
};