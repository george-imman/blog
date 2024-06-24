const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.secret, (err, user) => {
    if (err) return res.status(403).send({errorMessage: "Login Expired- Please login to continue"});
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
