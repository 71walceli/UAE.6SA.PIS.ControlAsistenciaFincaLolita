<?php 
require_once("__mysql__.php");
require_once("__json_config__.php");
require_once("../lib/phpqrcode/qrlib.php");

if ($_SERVER['QUERY_STRING'] == "crear_empleado") {
    # code...
}

# Datos y funciones específicas
$tabla = "codigo_qr";

# API
try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Si no existe, agregarlo
        $sql = "INSERT INTO $tabla(
                    token, 
                    fecha_hora
                ) VALUES (
                    unhex(sha2(RAND(), 512)),
                    NOW()
                )";
    
        $result = $mysql->query($sql);

        if ($result) {
            $response = array(
                "status" => "success",
                "message" => "Registro de $tabla guardado correctamente"
            );
            http_response_code(200);
            echo json_encode($response);
        } else {
            $response = array(
                "status" => "error",
                "message" => "Error al guardar registro de $tabla",
                "mysql_error" => $mysql->error,
                "mysql_errno" => $mysql->errno,
            );
            http_response_code(400);
            echo json_encode($response);
        }
    } 
    else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if ($_SERVER['QUERY_STRING'] == "ultimo") {
            $sql = "SELECT * FROM ${tabla}_vista_ultimo";
            $datos = $mysql->query($sql);
            $response['status'] = 'success';
            $response["data"]= $datos->fetch_all(MYSQLI_ASSOC);
            $datos->free_result();
            echo json_encode($response, JSON_PRETTY_PRINT);
        } 
        else {
            $sql = "SELECT * FROM ${tabla}_vista";
            $datos = $mysql->query($sql);
            $response['status'] = 'success';
            $response["data"]= $datos->fetch_all(MYSQLI_ASSOC);
            $datos->free_result();
            echo json_encode($response, JSON_PRETTY_PRINT);
        }
    }
    else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        $response['status'] = 'success';
        $response['message'] = '';
        http_response_code(200);
    
        $sql = "DELETE FROM $tabla 
                    WHERE id='".mysqli_escape_string($mysql, $postBody["id"])."'";
        $result = $mysql->query($sql);

        //$affected_rows = $result->affected_rows;
        if ($result) {
            $response = array(
                "status" => "success",
                "message" => "Registro de $tabla eliminado correctamente",
                //"affected" => $affected_rows,
            );
            http_response_code(200);
            echo json_encode($response);
        } else {
            $response = array(
                "status" => "error",
                "message" => "Error al eliminar registro de $tabla",
                "mysql_error" => $mysql->error,
                "mysql_errno" => $mysql->errno,
                //"affected" => $affected_rows,
            );

            http_response_code(400);
            echo json_encode($response);
        }
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
    $response["mensaje"] = "Errur SQL";
    $response["sql"] = $sql;
    $response["sqlErrorCode"] = $mysql->errno;
    $response["sqlError"] = $mysql->error;
    echo json_encode($response);
}



