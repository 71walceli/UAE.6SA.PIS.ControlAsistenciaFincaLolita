<?php
$mysql = new mysqli("localhost", "control_asistencia_finca_lolita", 
    "1234567890abcdef", "control_asistencia_finca_lolita");

define("contrasenia_sal_inicio", "54L");
define("contrasenia_sal_fin", "sAl");

function obtener_contrasenia($contrasenia) {
    return substr($contrasenia, 3, -3);
}

function generar_contrasenia($contrasenia) {
    return contrasenia_sal_inicio . $contrasenia . contrasenia_sal_fin;
}

// Código adaptado de https://github.com/diaspar/validacion-cedula-ruc-ecuador/blob/master/validadores/php/ValidarIdentificacion.php
// TODO Mover a __utils__.php las funciones después de esta línea
function obtenerDigitoVerificador($digitosIniciales) {
    $arrayCoeficientes = array(2,1,2,1,2,1,2,1,2);
    $digitosIniciales = str_split($digitosIniciales);
    $total = 0;
    
    foreach ($digitosIniciales as $key => $value) {

        $valorPosicion = ( (int)$value * $arrayCoeficientes[$key] );

        if ($valorPosicion >= 10) {
            $valorPosicion = str_split($valorPosicion);
            $valorPosicion = array_sum($valorPosicion);
            $valorPosicion = (int)$valorPosicion;
        }

        $total = $total + $valorPosicion;
    }

    $residuo =  $total % 10;

    if ($residuo == 0) {
        $resultado = 0;
    } else {
        $resultado = 10 - $residuo;
    }

    return $resultado;
}

function verificarCedula($numeroCedula) {
    $digitosIniciales = substr($numeroCedula, 0, 9);
    $digitusVerificadorTentativo = substr($numeroCedula, 9);
    $digitusVerificador = obtenerDigitoVerificador($digitosIniciales);

    return $digitusVerificadorTentativo == $digitusVerificador;
}

