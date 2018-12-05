
//const { sequelize, Sequelize }  = require('../../config/');
//const userModel = require('./user-model');
module.exports = (sequelize, type) => {

    return sequelize.define('orders', {
    id:{
        type: type.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
    },
    photographer_id:{
        type: type.INTEGER
    },
    user_id: {
        type: type.INTEGER
    },
    address : {
        type: type.STRING
    },
    lat : {
        type: type.STRING
    },
    longi : {
        type: type.STRING
    },
    order_status: {
        type: type.TINYINT,
        defaultValue: 1
    },
    status: {
        type: type.TINYINT,
        defaultValue: 0
    },
    accepted_at: {
        type: type.DATE
    },
    end_time:{
        type: type.DATE
    },
    hours:{
        type: type.INTEGER
    },
    accepted_at: {
        type: type.DATE
    },
    start_time : {
        type: type.DATE
    },
    users_s_ratings:{
        type: type.INTEGER
    },
    photographer_s_ratings:{
        type: type.INTEGER
    },
    user_s_review : {
        type: type.STRING
    },
    photographer_s_review : {
        type: type.STRING
    },
    is_paid:{
        type: type.TINYINT,
        defaultValue: 0
    },
    created_at: {
        type: type.DATE
    }
  }, { timestamps: true, tableName: 'orders', createdAt: 'created_at',
  updatedAt: 'updated_at' });
}
//orders.belongsTo(userModel, { foreignKey: 'user_id' }); // Adds user_id to orders
// orders.associate = function (models) {
//     models.orders.belongsTo(models.user, 
//         { foreignKey: 'user_id' }
//     );
// };
//module.exports = orders;