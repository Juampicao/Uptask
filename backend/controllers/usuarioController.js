import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req, res) => {
  // Evitar registros Duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error(`Usuario Ya Registrado`);
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body); // 1 Creo un usuario.
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save(); // 2 Aca alamcena en la base de datos.
    res.json({
      msg: "Usuario Creado Correctamente, Revisa tu email para crear tu cuenta.",
    });
  } catch (error) {
    console.log(error);
  }
  // res.json({ msg: "Creando Usuario.." });
};

// AUTENTICANDO
const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario EXISTE
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  console.log(usuario);

  // Comprobar si el usuario CONFIMADO
  if (!usuario.confirmado) {
    const error = new Error("El usuario no ha sido confirmado");
    return res.status(403).json({ msg: error.message });
  }
  console.log(usuario);

  // Comprobar PASSWORD
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
    console.log("El password es Correcto");
  } else {
    const error = new Error("El password es incorrecto");
    console.log("El password es Incorrecto");

    return res.status(403).json({ msg: error.message });
  }
};

// Confirmar usuario mediante token. Una vez confirmado, se borra.
const confirmar = async (req, res) => {
  console.log(req.params); // Obtiene el token dinamico.
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario Confirmado Correctamente" });
    console.log(usuarioConfirmar);
  } catch (error) {}
};

// Olvidar Contreña
const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
    console.log(usuario);
  } catch (error) {
    console.log(error);
  }
};

// Validar Token
const validarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token válido y el Usuario Existe." });
  } else {
    const error = new Error("Token no válido.");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log(token);
  console.log(password);
  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = ``;
    try {
      await usuario.save();
      res.json({ msg: "Password Modificada correctamente." });
    } catch (error) {}
  } else {
    const error = new Error("Token no válido.");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;

  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  validarToken,
  nuevoPassword,
  perfil,
};
