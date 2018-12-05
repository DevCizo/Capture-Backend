
//const { sequelize, Sequelize }  = require('../../config/');

module.exports = (sequelize, DataTypes) => {

    return sequelize.define('photographer_stripe_detail', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    photographer_id:{
        type: DataTypes.INTEGER
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    state : {
        type: DataTypes.STRING
    },
    postal_code : {
        type: DataTypes.INTEGER
    },
    dob : {
        type: DataTypes.DATE
    },
    document : {
        type: DataTypes.STRING
    },
    stripe_customer_id: {
        type: DataTypes.STRING
    },
    personal_identity_number: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    created_at: {
        type: DataTypes.DATE
    }
  }, 
  {
    timestamps: true,
    tableName: 'photographer_stripe_detail', 
    createdAt: 'created_at',
   updatedAt: 'updated_at'
 });
}