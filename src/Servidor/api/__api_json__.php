<?php
// TODO Hacer uso para código futuro.
function responder($statos_code, $repponseObject) {
    http_response_code($statos_code);
    echo json_encode($repponseObject);
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

