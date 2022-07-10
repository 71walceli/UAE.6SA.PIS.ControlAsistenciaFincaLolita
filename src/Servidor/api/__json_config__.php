<?php
// Configuración inicial de respuesta HTTP
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Authorization, Origin, Referres, User-Agent');
header('Access-Control-Allow-Methods:  POST, GET, DELETE');
header('Content-Type: application/json');
http_response_code(200);
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Consulta de políticas CORS por parte de los navegadores. Solo se requiere responder con los 
    //  encabezados.
    exit();
}

$rawPostBody = file_get_contents('php://input');
$postBody = json_decode($rawPostBody, true);
$postBodyOriginal = json_decode($rawPostBody, true);    // Se usará para poder mutar el dato original
                                                        // sin perder información original.

// TODO Autenticas con usuarios y contraseñas
$response = array();

function verificarParametrosExistentes($array, $lista) {
    foreach ($lista as $indice) {
        if (!isset($array[$indice]) || trim($array[$indice])=="") {
            return false;
        }
    }
    return true;
}

// TODO Crear funciones encargadas de las respuestas y refactorizar todo en función de estas
