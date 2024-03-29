import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import { pool } from "../Database/connection.js";
import jwt from "jsonwebtoken";
import { querys } from "../Database/querys.js";
import QueryStream from "pg-query-stream";

import dotenv from "dotenv";
dotenv.config();

export const obtenerRegistros = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM docente");
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
};
export const enviarCorreo = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bagdiana03@gmail.com",
        pass: "upwlojvmpxuahhyy",
      },
    });

    const {destinatario, nombre, fecha, hora, origen, destino, enlace} = req.body;
    console.log(destinatario)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2; /* Color de fondo */
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px; /* Bordes redondeados */
            background-color: #fff; /* Color de fondo del contenedor */
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra */
          }
          .header {
            text-align: center;
            color: #333; /* Color del encabezado */
            font-size: 24px; /* Tamaño del texto del encabezado */
            margin-bottom: 20px;
          }
          .info {
            margin-bottom: 20px;
            color: #666; /* Color del texto de información */
          }
          .info p {
            margin: 5px 0;
          }
          .download-link {
            text-align: center;
          }
          .image-container {
            text-align: center;
            margin-top: 20px;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>¡Ya tienes tu boleto de autobús!</h2>
          </div>
          <div class="info">
            <p>Hola ${nombre}!</p>
            <p>Fecha del viaje: ${fecha}<br>
               Hora de salida: ${hora}<br>
               Origen: ${origen}<br>
               Destino: ${destino}</p>
          </div>
          <div class="download-link">
            <p>Por favor, haga clic en el siguiente enlace para descargar su boleto: <a href="${enlace}">Enlace de descarga</a></p>
          </div>
          <div class="info">
            <p>Si tiene alguna pregunta o necesita asistencia adicional, no dude en ponerse en contacto con nosotros. ¡Estamos aquí para ayudarle!</p>
            <p>Flecha Amarilla</p>
          </div>
          <div class="image-container">
            <img src="https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/Captura%20de%20pantalla%202024-03-26%20220537.png?alt=media&token=1b3504aa-9a28-402b-bbed-c8b68ce6c8ef" alt="Imagen 1">
          </div>
        </div>
      </body>
    </html>
`;

    const message = {
      from: "bagdiana03@gmail.com",
      to: destinatario,
      subject: "YellowPass",
      html: htmlContent,
    };

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error);
        res.send("Error al enviar el correo electrónico");
      } else {
        console.log("Correo electrónico enviado: " + info.response);
        res.send("Correo electrónico enviado correctamente");
      }
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const EliminarUsuarioTodo = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(querys.EliminarUsuarioTodo);
    res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const AltaCuentaDocente = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const [Numero_Personal, Contraseña, Correo, URL_Imagen] = req.body;

    const client = await pool.connect();

    const existencia = await client.query(querys.DocenteExistencia, [
      Numero_Personal,
    ]);
    const contar = await client.query(querys.CuentaExistente, [Correo]);
    if ((existencia.rows[0].count = 1)) {
      if (contar.rows[0].count == 0) {
        await client.query(querys.InsertarCuentaDocente, [
          Numero_Personal,
          Contraseña,
          Correo,
          URL_Imagen,
        ]);
        res.json({ Numero_Personal, Contraseña, Correo, URL_Imagen });
      } else {
        return res.status(400).json("La cuenta ya existe!!!");
      }
    } else {
      return res
        .status(400)
        .json("El numero de personal no esta registrado en el sistema");
    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const ObtenerInfoDocente = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, "Centenito");

    const { NumeroPersonal } = decodedToken;

    const client = await pool.connect();
    const result = await client.query(querys.ObtenerInfoDocentes, [
      NumeroPersonal,
    ]);

    const { nombre, no_personal, facultad, url_imagen } = result.rows[0];

    res.json({ nombre, no_personal, facultad, url_imagen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const DocentesMateria = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, "Centenito");
    const { NumeroPersonal } = decodedToken;
    const client = await pool.connect();
    const result = await client.query(querys.VerMateriaDocente, [
      NumeroPersonal,
    ]);
    const nrcs = result.rows.map((row) => row.ncr_materia);

    res.json({ nrcs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const Traer = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM docentes");
    client.release();

    const docentes = result.rows;
    res.status(200).json(docentes);
  } catch (error) {
    console.error("Error al obtener los docentes:", error);
    res.status(500).json({ error: "Error al obtener los docentes" });
  }
};

export const materiaSalon = async (req, res) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, "Centenito");
  const { Valor } = decodedToken;
  let nrc = parseInt(Valor.valor, 10);
  try {
    let result = await pool.query(querys.InfoMaterias, [nrc]);

    res.send(result.rows);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const materiaSalonHorario = async (req, res) => {
  const { horario, dia } = req.body;
  try {
    const result = await pool.query(querys.MateriaHorario, [horario, dia]);

    const nrcs = result.rows;

    const informacionMaterias = [];

    for (const nrc of nrcs) {
      const nuevaInformacionMateria = await encontrarMateria(nrc.nrc);
      nuevaInformacionMateria.nrc = nrc.nrc;
      nuevaInformacionMateria.salon = nrc.salon;
      nuevaInformacionMateria.edificio = nrc.edificio;
      informacionMaterias.push(nuevaInformacionMateria);
    }

    res.send(informacionMaterias);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

async function encontrarMateria(nrc) {
  const result = await pool.query(querys.ObtenerMateria, [nrc]);

  let guardar = result.rows.map((dato) => dato);

  return guardar[0];
}

//Este controlador recibe todos los NRC correspondientes al docente y devolverá la información de cada nrc
export const encontrarMateriaDocente = async (req, res) => {
  //recibir token de la petición y guardarlo en una nueva variable
  const token = req.headers.authorization;
  //decifrar el token con la contraseña definida
  const decodedToken = jwt.verify(token, "Centenito");
  //almacenar el valor de token en una nueva variable como objeto
  const { Valor } = decodedToken;
  //almacenar el objeto en una variable
  let NRCs = Valor;
  //validar que los datos obtenidos sean un arreglo, en caso de que no, los convierte en array
  if (!Array.isArray(NRCs)) {
    NRCs = [NRCs];
  }

  try {
    //Realizar consulta para la obtención de información de cada NRC
    //Se hará a traves de la función map perteneciente al tipo array
    const result = await Promise.all(
      //obtención de información por objeto encontrado en el array y se guarda en constante result
      NRCs.map((NRC) => pool.query(querys.EncontrarMateriaDocente, [NRC]))
    );
    //almacenar en una variable la información necesaria de la petición anterior
    const responseData = result.map((res) => res.rows[0]);

    console.log(responseData);
    //se retorna la información filtrada al front
    res.send(responseData);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const generarToken = async (req, res) => {
  try {
    const valor = req.body;
    const token = jwt.sign({ Valor: valor }, "Centenito");
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const IniciarSesion = async (req, res) => {
  try {
    const { Correo, Contraseña } = req.body;
    const result = await pool.query(querys.verificarCuenta, [
      Correo,
      Contraseña,
    ]);

    if (result.rows.length === 1) {
      const { no_personal } = result.rows[0];
      const token = jwt.sign({ NumeroPersonal: no_personal }, "Centenito");
      res.json({ token });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerAlumno = async (req, res) => {
  const { matricula } = req.headers;

  try {
    const result = await pool.query(querys.ObtenerInfoAlumnos, [matricula]);
    res.send(result.rows);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
