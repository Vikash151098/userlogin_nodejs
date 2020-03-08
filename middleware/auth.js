const jwt = require('jsonwebtoken');
const config = require('config');

userAuth = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.jwtData = decoded;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
adminAuth = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.jwtData = decoded;
    if (!decoded.isAdmin) return res.status(403).send({ statusCode: 403, message: "Failure", data: "Access denied " })

    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

exports.userAuth = userAuth;
exports.adminAuth = adminAuth;

