const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createSuperUser = async (email, password) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('El usuario ya existe.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await user.save();
    console.log('Superusuario creado exitosamente.');
  } catch (error) {
    console.error('Error al crear el superusuario:', error);
  } finally {
    mongoose.disconnect();
  }
};

const [,, argEmail, argPassword] = process.argv;
const email = argEmail || process.env.SUPERADMIN_EMAIL;
const password = argPassword || process.env.SUPERADMIN_PASSWORD;

if (!email || !password) {
  console.log('Faltan credenciales. Pase email y contraseña como argumentos o configure SUPERADMIN_EMAIL y SUPERADMIN_PASSWORD en el archivo .env.');
  process.exit(1);
}

createSuperUser(email, password);