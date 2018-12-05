const { jwt, secret } = require('../../config/');
// Login user.
const auth = (req, res, next) => {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });
    
    jwt.verify(token, secret, function(err, decoded) {
      if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token or Token is expired' });
      req.user = decoded
    });
}

module.exports = {
    auth: auth
}