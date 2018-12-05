module.exports = (sequelize, type) => {
    return  sequelize.define('photographer_cards', {
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        photographer_id: {
            type: type.INTEGER
        },
        last_four:{
            type: type.INTEGER
        },
        card_token:{
            type: type.STRING 
        },
        is_default:{
            type: type.TINYINT,
            defaultValue: 0
        },
        name: {
            type: type.STRING
        },
        brand: {
            type: type.STRING
        },
        status: {
            type: type.TINYINT,
            defaultValue: 0
        },
        created_at: {
            type: type.DATE
        }
    }, 
    { timestamps: true,
        tableName: 'photographer_cards', 
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
    );
}