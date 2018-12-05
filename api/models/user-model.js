module.exports = (sequelize, type) => {
    
    return  sequelize.define('user', {
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
        type: type.STRING
        },
        password: {
        type: type.STRING
        },
        email: {
            type: type.STRING
        },
        mobile: {
            type: type.STRING,
            unique: 'uniqueTag'
        },
        sms_code: {
            type: type.STRING
        },
        profile_pic: {
            type: type.STRING
        },
        device_token: {
            type: type.STRING 
        },
        is_push_on: {
            type: type.TINYINT,
            defaultValue: 1
        },
        is_verified: {
            type: type.TINYINT,
            defaultValue: 0
        },
        stripe_customer_id: {
            type: type.STRING
        },
        has_card:{
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
        tableName: 'user', 
        createdAt: 'created_at',
        updatedAt: 'updated_at'
       
    }
    );
}