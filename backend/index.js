import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

// Configurar CORS
// const whiteList = [`http://localhost:3000`];
const whiteList = [process.env.FRONTEND_URL];

console.log(`La variable de entorno es ${process.env.FRONTEND_URL}`);

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      console.log(origin);
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de cors"));
    }
  },
};

app.use(cors(corsOptions));

// Routing
app.use(`/api/usuarios`, usuarioRoutes);
app.use(`/api/proyectos`, proyectoRoutes);
app.use(`/api/tareas`, tareaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
