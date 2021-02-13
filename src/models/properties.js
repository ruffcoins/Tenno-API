module.exports = (sequelize, Sequelize) =>{
    return sequelize.define('properties', {
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
        address:{
            type: Sequelize.STRING,
            unique: true,
            allowNull:false,
            validate: {
                notNull: { msg: "address is required" },
            },
        },
        no_of_rooms: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        description: {
            type: Sequelize.TEXT
        }
    },{
        timestamps: true,
        freezeTableName: true,
    })
};