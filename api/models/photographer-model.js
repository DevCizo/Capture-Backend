
//const { sequelize, Sequelize }  = require('../../config/');

module.exports = (sequelize, DataTypes) => {

    return sequelize.define('photographers', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    mobile: {
        type: DataTypes.STRING
    },
    sms_code: {
        type: DataTypes.STRING
    },
    profile_pic : {
        type: DataTypes.STRING
    },
    about_me : {
        type: DataTypes.STRING
    },
    photo_equipment : {
        type: DataTypes.STRING
    },
    portfolio_link : {
        type: DataTypes.STRING
    },
    longi: {
        type: DataTypes.STRING
    },
    lat: {
        type: DataTypes.STRING
    },
    device_token: {
       type: DataTypes.STRING 
    },
    is_online: {
        type: DataTypes.TINYINT 
     },
    is_push_on: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    ratings :{
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    is_verified: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    has_card :{
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    is_stripe_verified :{
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE
    }
  }, 
  {
    timestamps: true, 
    tableName: 'photographers', 
    createdAt: 'created_at',
   updatedAt: 'updated_at'
 });
}
//module.exports = photographer;