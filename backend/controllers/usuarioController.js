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
    res.json(usuarioAlmacenado);
  } catch (error) {
    console.log(error);
  }
  res.json({ msg: "Creando Usuario.." });
};

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

const confirmar = async (req, res) => {
  console.log(req.params); // Obtiene el token dinamico.
  const { token } = req.params;
};
export { registrar, autenticar, confirmar };
