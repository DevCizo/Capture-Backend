const { Sequelize, sequelize  } =  require('../../config');

const User = require('./user-model');
const Photo = require('./photographer-model');
const Order = require('./orders-model');
const UserCards = require('./user-cards-model');
const PhotographerStripeDetails = require('./photographer-stripe-details-model');
const PhotographerCards = require('./photographer-cards-model');
const OrderTransactons = require('./orders-transactions');

const userModel = User(sequelize, Sequelize);
const photographerModel = Photo(sequelize, Sequelize);
const orderModel = Order(sequelize, Sequelize);
const userCardModel  = UserCards(sequelize, Sequelize);
const photographerStripeModel = PhotographerStripeDetails(sequelize, Sequelize);
const photographerCardsModel = PhotographerCards(sequelize, Sequelize);
const orderTransactonsModel = OrderTransactons(sequelize, Sequelize);


// Association will define here
orderModel.belongsTo(userModel, { foreignKey: 'user_id' });
orderModel.belongsTo(photographerModel, { foreignKey: 'photographer_id' });


module.exports = {
    userModel,
    photographerModel,
    orderModel,
    userCardModel,
    photographerStripeModel,
    photographerCardsModel,
    orderTransactonsModel
}