<?php 
require_once("__mysql__.php");
require_once("__json_config__.php");

if ($_SERVER['QUERY_STRING'] == "crear_empleado") {
    # code...
}

# Datos y funciones específicas
$tabla = "asistencia";

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

# API
try {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($_SERVER["QUERY_STRING"] == "registrar") {
            // TODO Crear una nueva asistencia desde el celular deba requerir la contraseña.
            if (!verificarParametrosExistentes($postBody, array(
                    'empleado_id', 
                    "empleado_token_celular", 
                    "codigo_qr_token",
                ))
            ) {
                $response = array(
                    "status" => "error",
                    "message" => "Campos requeridos faltantes."
                );
                http_response_code(400);
                echo json_encode($response);
                exit();
            }
            procesarCedulaOResponderSiError($postBody);

            // Si no existe, agregarlo
            $sql = "INSERT INTO $tabla(
                            empleado_id, 
                            codigo_qr_id, 
                            fecha_hora,
                            observacion
                        ) VALUES (
                            '".mysqli_escape_string($mysql, $postBody["empleado_id"])."', 
                            (SELECT id FROM codigo_qr WHERE token=unhex(
                                '".mysqli_escape_string($mysql, $postBody["codigo_qr_token"])."'
                            )), 
                            now(), 
                            '' 
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
            exit();
        }
        // Buscar si existe
        $sql = "SELECT id 
            FROM $tabla
            WHERE id='".mysqli_escape_string($mysql, $postBody['id'])."'";
        $result = $mysql->query($sql);

        if ($result && $result->num_rows > 0) {
            # Validaciones
            if (!verificarParametrosExistentes($postBody, array(
                    'id', 
                    "fecha_hora",
                    "observacion",
                ))
            ) {
                $response = array(
                    "status" => "error",
                    "message" => "Campos requeridos faltantes."
                );
                http_response_code(400);
                echo json_encode($response);
                exit();
            }
            
            // Actualizar si el registro existe
            $sql = "UPDATE $tabla 
                        SET 
                            fecha_hora='".mysqli_escape_string($mysql, $postBody["fecha_hora"])."',
                            observacion='".mysqli_escape_string($mysql, $postBody["observacion"])."'
                        WHERE id='".mysqli_escape_string($mysql, $postBody["id"])."'";
        } 
        else {
            // TODO Crear una nueva asistencia desde el celular deba requerir la contraseña.
            if (!verificarParametrosExistentes($postBody, array(
                    'empleado_id', 
                    "codigo_qr_token", 
                    "observacion",
                ))
            ) {
                $response = array(
                    "status" => "error",
                    "message" => "Campos requeridos faltantes."
                );
                http_response_code(400);
                echo json_encode($response);
                exit();
            }
            procesarCedulaOResponderSiError($postBody);

            if (!isset($postBody["fecha_hora"])) {
                $fecha_hora = "now()";
            } else {
                $fecha_hora = "'".
                    mysqli_escape_string($mysql, $postBody["fecha_hora"])
                ."'";
            }

            // Si no existe, agregarlo
            $sql = "INSERT INTO $tabla(
                            empleado_id, 
                            codigo_qr_id, 
                            fecha_hora,
                            observacion
                        ) VALUES (
                            '".mysqli_escape_string($mysql, $postBody["empleado_id"])."', 
                            (SELECT id FROM codigo_qr WHERE token=unhex(
                                '".mysqli_escape_string($mysql, $postBody["codigo_qr_token"])."'
                            )), 
                            $fecha_hora, 
                            '".mysqli_escape_string($mysql, $postBody["observacion"])."' 
                        )";
        }
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
        // TODO Debería pedir credenciales antes de revelar los datos.
        $sql = "SELECT * FROM ${tabla}_vista";
        $datos = $mysql->query($sql);
        $response['status'] = 'success';
        $response["data"]= $datos->fetch_all(MYSQLI_ASSOC);
        $datos->free_result();
        echo json_encode($response, JSON_PRETTY_PRINT);
    }
    else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        if (!verificarParametrosExistentes($postBody, array(
                'id', 
            ))
        ) {
            $response = array(
                "status" => "error",
                "message" => "Campos requeridos faltantes."
            );
            http_response_code(400);
            echo json_encode($response);
            exit();
        }
        procesarCedulaOResponderSiError($postBody);

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



