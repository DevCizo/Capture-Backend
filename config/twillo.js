const accountSid = 'ACa50e837ad350ed6c3874dd568bc28d87';
const authToken = 'fca00b2bedf1a41876de71a38b9dafd0';
const client = require('twilio')(accountSid, authToken);
module.exports = client;