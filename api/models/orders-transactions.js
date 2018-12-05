module.exports = (sequelize, type) => {
    return  sequelize.define('order_transactions', {
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: type.INTEGER
        },
        transaction_id:{
            type: type.STRING 
        },
        card_source :{
            type: type.STRING
        },
        amount : {
            type: type.FLOAT
        },
        is_captured:{
            type: type.TINYINT,
            defaultValue: 0
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
        tableName: 'order_transactions', 
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
    );
}