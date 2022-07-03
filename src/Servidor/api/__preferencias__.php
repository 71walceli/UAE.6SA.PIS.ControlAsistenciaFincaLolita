<?php
/**
 * Solo para uso interno del aplicativo
 */
function cargarPreferenciasHoras($mysql) {
    $datos = array(
        "horaEntrada" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='horaEntrada'")
            ->fetch_all()[0][0],
        "horaReceso" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='horaReceso'")
            ->fetch_all()[0][0],
        "horaRecesoFin" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='horaRecesoFin'")
            ->fetch_all()[0][0],
        "horaSalida" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='horaSalida'")
            ->fetch_all()[0][0],
        "minHoraEntrada" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='minHoraEntrada'")
            ->fetch_all()[0][0],
        "maxHoraEntrada" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='maxHoraEntrada'")
            ->fetch_all()[0][0],
        "maxHoraReceso" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='maxHoraReceso'")
            ->fetch_all()[0][0],
        "minHoraRecesoFin" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='minHoraRecesoFin'")
            ->fetch_all()[0][0],
        "maxHoraRecesoFin" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='maxHoraRecesoFin'") 
            ->fetch_all()[0][0],
        "maxHoraSalida" 
            => $mysql->query("SELECT valor FROM preferencia WHERE nombre='maxHoraSalida'")
            ->fetch_all()[0][0]
        );
        
    return $datos;
}

