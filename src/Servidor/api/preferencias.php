<?php 
require_once("__mysql__.php");
require_once("__json_config__.php");
require_once("__parse_url_query__.php");
require_once("__api_json__.php");
require_once("__preferencias__.php");

# Cargar configuraciones

# Datos y funciones específicas
$tabla = "preferencia";


function procesarCedulaOResponderSiError($postBody) {
    if (!isset($postBody["empleado_id"]) || !verificarCedula($postBody["empleado_id"])) {
        $response = array(
            "status" => "error",
            "message" => "Número de cédula no se pudo validar."
        );
        http_response_code(400);
        echo json_encode($response);
        exit();
    }
}

// TODO Pendiente de terminar POST y DELETE
# API
try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        # Validaciones
        // TODO Validar parámetro "valor", que solo sea cadena de texto.
        if (!verificarParametrosExistentes($postBody, array('nombre'))
        ) {
            responder(400, array(
                "status" => "error",
                "message" => "Campos requeridos faltantes."
            ));
        }
        // TODO Validar tipos de datos de entrada permitidos

        // Buscar si existe
        $sql = "SELECT nombre 
            FROM $tabla
            WHERE nombre='".mysqli_escape_string($mysql, $postBody['nombre'])."'";
        $result = $mysql->query($sql);

        if ($result && $result->num_rows > 0) {
            // Actualizar si el registro existe
            $sql = "UPDATE $tabla 
                        SET 
                            valor='".mysqli_escape_string($mysql, $postBody["valor"])."'
                        WHERE nombre='".mysqli_escape_string($mysql, $postBody["nombre"])."'";
            $result = $mysql->query($sql);
    
            if ($result) {
                responder(200, array(
                    "status" => "success",
                    "message" => "Registro de $tabla guardado correctamente"
                ));
            }
        }
        else {
            responder(400, array(
                "status" => "error",
                "message" => "Error al guardar registro de $tabla",
            ));
        }
        
    } 
    else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $sql = "SELECT * FROM ${tabla}_vista";
        $datos = $mysql->query($sql);
        $response['status'] = 'success';
        $response["data"]= $datos->fetch_all(MYSQLI_ASSOC);
        $datos->free_result();
        responder(200, $response);
    }
    else {
        $response = array();
        $response['status'] = 'error';
        $response['message'] = 'Solo se aceptan peticiones POST o GET.';
        http_response_code(400);
    
        echo json_encode($response);
    }
} catch (mysqli_sql_exception $th) {
    http_response_code(500);
    $response["message"] = "Errur SQL";
    $response["sql"] = $sql;
    $response["sqlErrorCode"] = $mysql->errno;
    $response["sqlError"] = $mysql->error;
    echo json_encode($response);
}



