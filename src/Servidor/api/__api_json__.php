<?php
// TODO Hacer uso para código futuro.
function responder($codigoHttp, $objetoRespuesta) {
    http_response_code($codigoHttp);
    echo json_encode($objetoRespuesta);
    exit();
}

// TODO Proponer patrón de diseño que organice el código de los puntos de entrada de la susuiente 
//  manera:
//  - Recepción solicitod
//  - Selección punto entrada
//  - Validaciones
//  - Procesamiento
//      - Procesos misceláneos
//      - Almacenamiento en BD
//  - Respuesta

date_default_timezone_set("America/Bogota");

