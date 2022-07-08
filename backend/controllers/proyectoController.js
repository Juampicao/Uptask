import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find().where("creador").equals(req.usuario);
  // Solo obtener los que el que esta logueado creo.
  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);
  // .populate({
  //   path: "tareas",
  //   populate: { path: "completado", select: "nombre" },
  // })
  // .populate("colaboradores", "nombre email");
  if (!proyecto) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }
  if (
    proyecto.creador.toString() !== req.usuario._id.toString() &&
    !proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción No Válida");
    return res.status(401).json({ msg: error.message });
  }
  res.json(proyecto);
};

// Si cambio solo uno, lo demas sigue igual. Solo edita quien lo creo.
const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(401).json({ msg: error.message });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción No Válida");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};

const obtenerTareas = async (req, res) => {};

export {
  obtenerProyecto,
  nuevoProyecto,
  obtenerProyectos,
  editarProyecto,
  eliminarColaborador,
  eliminarProyecto,
  agregarColaborador,
  obtenerTareas,
};
