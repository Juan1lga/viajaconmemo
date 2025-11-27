const jwt = require('jsonwebtoken');

const auth = function(req, res, next) {
  // Obtener el token del encabezado (soporta 'x-auth-token' y 'Authorization: Bearer <token>')
  let token = req.header('x-auth-token');
  if (!token && req.headers['authorization']) {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    if (!req.user || !req.user.isAdmin) {
      return res.status(401).json({ msg: 'No eres un administrador' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'El token no es válido' });
  }
};

module.exports = auth;
module.exports.requireAdmin = auth;