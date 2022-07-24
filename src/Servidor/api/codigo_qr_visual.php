<?php
require_once("__mysql__.php");
require_once("__json_config__.php");
require_once("__parse_url_query__.php");
require_once("../lib/phpqrcode/qrlib.php");

# API
try {
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if ($_SERVER['QUERY_STRING'] == "render_ultimo_qr") {
            $sql = "SELECT * FROM codigo_qr_vista_ultimo";
            $result = $mysql->query($sql);
            //$response['status'] = 'success';
            $dato = $result->fetch_all(MYSQLI_ASSOC)[0]["token"];
            $result->free_result();
            //QRcode::png(json_encode($response, JSON_PRETTY_PRINT), false, QR_ECLEVEL_L, 15, 20);
            QRcode::png($dato, false, QR_ECLEVEL_L, 15, 5);
        } 
        else if (isset($queryParams["render_empleado_id"])) {
            $sql = "SELECT * FROM empleado_vista WHERE id="
                .$mysql->escape_string($queryParams["render_empleado_id"])."";
            $result = $mysql->query($sql);

            if ($result && $result->num_rows > 0) {
                $dato = $result->fetch_all(MYSQLI_ASSOC)[0];
                $result->free_result();
                QRcode::png(json_encode($dato), false, QR_ECLEVEL_L, 15, 5);
            } else {    
                $response = array();
                $response['status'] = 'error';
                $response['message'] = 'Empleado no encontrado';
                http_response_code(400);
                echo json_encode($response);    
            } 
        }
        else {
            $response = array();
            $response['status'] = 'error';
            $response['message'] = 'Solo se aceptan peticiones GET.';
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
    $response["message"] = "Errur SQL";
    $response["sql"] = $sql;
    $response["sqlErrorCode"] = $mysql->errno;
    $response["sqlError"] = $mysql->error;
    echo json_encode($response);
}




