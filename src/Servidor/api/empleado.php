<?php 
require_once("__mysql__.php");
require_once("__json_config__.php");

if ($_SERVER['QUERY_STRING'] == "crear_empleado") {
    # code...
}

# Datos y funciones específicas
$tabla = "empleado";

// TODO Necesario también en API Asistencia, pero con clave modificada
// TODO Validar que el tipo de empleado sea solamente j (jornalero) o a (administrador)
function procesarCedulaOResponderSiError($postBody) {
    if (!isset($postBody["id"]) || !verificarCedula($postBody["id"])) {
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
        // Buscar si existe
        $sql = "SELECT id 
            FROM $tabla
            WHERE id='".mysqli_escape_string($mysql, $postBody['id'])."'";
        $result = $mysql->query($sql);

        if ($result && $result->num_rows > 0) {
            # Validaciones
            // TODO Codigo que usa verificarParametrosExistentes deben y que responda si inválido
            //  debe ser refactorizado en una función.
            if (!verificarParametrosExistentes($postBody, array(
                    'id', 
                    "nombre", 
                    "token_celular", 
                    "activo", 
                    "tipo",
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

            // Actualizar si el registro existe
            $sql = "UPDATE $tabla 
                        SET 
                            nombre='".mysqli_escape_string($mysql, $postBody["nombre"])."', 
                            token_celular=unhex(sha2('".generar_contrasenia(mysqli_escape_string($mysql, $postBody["token_celular"]))."', 512)), 
                            tipo='".mysqli_escape_string($mysql, $postBody["tipo"])."',
                            activo='".mysqli_escape_string($mysql, $postBody["activo"])."'
                        WHERE id='".mysqli_escape_string($mysql, $postBody["id"])."'";
        } else {
            if (!verificarParametrosExistentes($postBody, array(
                    'id', 
                    "nombre", 
                    "token_celular", 
                    "tipo",
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
                            id, 
                            nombre, 
                            token_celular, 
                            activo, 
                            tipo
                        ) VALUES (
                            '".mysqli_escape_string($mysql, $postBody["id"])."', 
                            '".mysqli_escape_string($mysql, $postBody["nombre"])."', 
                            unhex(sha2('".generar_contrasenia(mysqli_escape_string($mysql, $postBody["token_celular"]))."', 512)), 
                            '1', 
                            '".mysqli_escape_string($mysql, $postBody["tipo"])."' 
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



