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

    const {
      destinatario,
      nombre,
      origen,
      destino,
      terminal,
      hora,
      fecha,
      folio,
      numeroAsiento,
      tipoAsiento,
    } = req.body;

    const html_boleto = `
    <!DOCTYPE html>
<html lang="en">
<head>
   
    <title>Yellow Pass</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 600px;
            height: 500px;            
        }
        .header {
            text-align: center;
            color: #f1c40f;
            padding-top: 10px;
        }
        .content {
            display: flex;
            margin-top: 20px;
            height: 320px;
            width: 600px;
        }
        .left, .right, .left2{
            flex: 1;
            padding: 20px;
            box-sizing: border-box;
            border-radius: 10px;
        }
        .left {
            background-color: #E9E9E9;
            padding: 30px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap:20px; 
            max-width: 300px;
        }
        .left2 {
            background-color: #E9E9E9;
            padding: 30px;
            font-size: 9px;
            text-align: justify;
            color: #626262;
            
        }
        .left2 p{
            font-size: 10px;
            text-align: justify;
            margin: 4px;
        }
        .right {
            background-color: #FFCC00;
        }
        p {
            margin: 0px 0;
            font-weight: 600;
            font-size: 13px;
        }
        h3 {
            color: #626262;
            font-size: 13px;
            margin: 8px 0;
        }
        .qr-code img{
            width: 200px;
            border-radius: 15px;
            justify-content: center;
            align-items: center;
            margin-left: 30px;
            margin-top: 30px;
        }
        .qr-code p{
            font-size: 11px;
            color: #626262;
            margin: 20px;
        }
        .line {
            border-left: 2px solid #CCCCCC; /* Estilo de la línea */
            height: 250px; /* Altura igual a la del contenido */
            margin-right: 20px; /* Espacio entre la línea y el contenido */
            position: absolute;
            left: 307px;
            top: 490px;
        }
        .asiento{
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="background-color: transparent; color: #FFCC00; font-weight: 800; ">Yellow Pass</h1>
        </div>
        <div class="content">
            <div class="left">
                <div style="position: absolute; top: 135px;">
                    <h3 >Nombre: </h3>
                    <p >Datos.nombre</p>
                    <hr style="margin: 10; width: 230px; position: absolute;"> 
                    <hr style="margin: 10; width: 230px; position: absolute; top: 197px;"> 
                </div>
                <div class="info" style="padding-top: 60px;" >
                    <h3>Hora:</h3>
                    <p>hora</p>
                    <h3>Origen: </h3>
                    <p>origen</p>
                    <h3>Folio:</h3>
                    <p>123456789</p>
                    <h3 class="asiento">Número de Asiento: </h3>
                    <p>12</p>
                </div>
                <div class="info" style="padding-top: 60px;" >
                    <h3>Fecha: </h3>
                    <p>14-02-23</p>
                    <h3>Destino: </h3>
                    <p>destino</p>
                    <h3>Terminal:</h3>
                    <p>terminal</p>
                    <h3 class="asiento">Tipo de Asiento:</h3>
                    <p>estandar</p>
                </div>
            </div>
            <div class="right">
                <div class="qr-code">
                    <img src="https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/istockphoto-1095468748-612x612.jpg?alt=media&token=1847cf87-7b9e-44de-89d8-e37c2482881d" alt="QR Code">
                    <p>Presente este QR al abordar el autobús</p>
                </div>
            </div>
        </div>
        <div class="line"></div>
        <div class="content">
            <div class="left2">
                <div >
                    <p>Condiciones del boleto:</p>
                    <p>Datos.condiciones_boleto</p>
                    <p>Instrucciones de abordaje:</p>
                    <p>Sigue las instrucciones del personal para un viaje seguro</p>
                    <p>Informa cualquier problema o necesidad al personal</p>
                    <p>Instrucciones sobre el Abordaje:</p>
                    <p>Datos.instrucciones_abordaje</p>
                    <p>Terminos y condiciones</p>
                    <p>Datos.terminos_condiciones</p>
                </div>
            </div>
            <div class="left2">
                <div >
                    <p>Información de la compañia:</p>
                    <p>Nombre</p>
                    <p>Datos.Nombre_Compañia</p>
                    <p>Dirección:</p>
                    <p>Datos.Direccion</p>
                    <p>Teléfono:</p>
                    <p>Datos.Telefono</p>
                    <p>Correo:o</p>
                    <p>Datos.Correo</p>
                    <p>Sitio web</p>
                    <p>Datos.Sitio_web</p>
                    <p>Documentación Requerida:</p>
                    <p>Datos.documentacion_abordaje</p>
                    <p>Instrucciones de seguridad:</p>
                    <p>Datos.Instrucciones de seguridad</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
    const message = {
      from: "bagdiana03@gmail.com",
      to: destinatario,
      subject: "YellowPass",
      html: html_boleto,
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
