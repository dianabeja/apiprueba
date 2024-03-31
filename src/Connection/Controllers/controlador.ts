export function boleto_template(Datos: any): string {
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
                    <p >${Datos.nombre}</p>
                    <hr style="margin: 10; width: 230px; position: absolute;"> 
                    <hr style="margin: 10; width: 230px; position: absolute; top: 197px;"> 
                </div>
                <div class="info" style="padding-top: 60px;" >
                    <h3>Hora:</h3>
                    <p>${Datos.hora}</p>
                    <h3>Origen: </h3>
                    <p>${Datos.origen}</p>
                    <h3>Folio:</h3>
                    <p>${Datos.folio}</p>
                    <h3 class="asiento">Número de Asiento: </h3>
                    <p>12</p>
                </div>
                <div class="info" style="padding-top: 60px;" >
                    <h3>Fecha: </h3>
                    <p>${Datos.fecha}</p>
                    <h3>Destino: </h3>
                    <p>${Datos.destino}</p>
                    <h3>Terminal:</h3>
                    <p>${Datos.terminal}</p>
                    <h3 class="asiento">Tipo de Asiento:</h3>
                    <p>${Datos.estandar}</p>
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
                    <p>${Datos.condiciones_boleto}</p>
                    <p>Instrucciones de abordaje:</p>
                    <p>Sigue las instrucciones del personal para un viaje seguro</p>
                    <p>Informa cualquier problema o necesidad al personal</p>
                    <p>Instrucciones sobre el Abordaje:</p>
                    <p>${Datos.instrucciones_abordaje}</p>
                    <p>Terminos y condiciones</p>
                    <p>${Datos.terminos_condiciones}</p>
                </div>
            </div>
            <div class="left2">
                <div >
                    <p>Información de la compañia:</p>
                    <p>Nombre</p>
                    <p>${Datos.Nombre_Compañia}</p>
                    <p>Dirección:</p>
                    <p>${Datos.Direccion}</p>
                    <p>Teléfono:</p>
                    <p>${Datos.Telefono}</p>
                    <p>Correo:o</p>
                    <p>${Datos.Correo}</p>
                    <p>Sitio web</p>
                    <p>${Datos.Sitio_web}</p>
                    <p>Documentación Requerida:</p>
                    <p>${Datos.documentacion_abordaje}</p>
                    <p>Instrucciones de seguridad:</p>
                    <p>${Datos.Instrucciones_seguridad}</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
    return html_boleto;
}
