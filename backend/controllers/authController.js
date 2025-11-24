const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Permitir registro de nuevos administradores solo a usuarios autenticados con rol de administrador
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ msg: 'El registro de nuevos administradores no está permitido' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    user = new User({
      email,
      password,
      isAdmin: true
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Intento de login', { email });

    let user = await User.findOne({ email });
    console.log('Usuario encontrado:', !!user, user ? user.id : null);
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Comparación de contraseña:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };
    console.log('JWT_SECRET definido:', !!process.env.JWT_SECRET);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          console.error('Error al firmar JWT:', err);
          throw err;
        }
        res.json({ token, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
      }
    );
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).send('Error del servidor');
  }
};