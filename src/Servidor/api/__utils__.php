<?php
class Hora {
    public $hora = 0;
    public $minuto = 0;
    public $segundo = 0;
    
    /*
    public function __construct($hora, $minuto, $segundo) {
        $this->$hora = $hora;
        $this->$minuto = $minuto;
        $this->$segundo = $segundo;
    }
    */
    
    function __construct($cadenaHora) {
        $parametros = explode(":", $cadenaHora);
        $this->hora = (int) $parametros[0];
        $this->minuto = (int) $parametros[1];
        //throw new Error(var_export($this, true));
    }

    function valorSegundos() {
        return $this->hora*60*60 +$this->minuto*60 +$this->segundo;
    }

    function estaEnRango(Hora $horaMin, Hora $horaMax) {
        /*
        if (!isset($horaMin) || !isset($horaMax) 
            || !($horaMin instanceof Hora) || !($horaMax instanceof Hora)
        ) {
            throw new Error("Values passed in were $horaMin, $horaMax. No null or allowed");
        }
        $valorHoraMin = $horaMin->hora*24*60 +$horaMin->minuto
        */
        return $horaMin->valorSegundos() <= $this->valorSegundos() 
            && $this->valorSegundos() <= $horaMax->valorSegundos();
    }

    function __toString() {
        $hora = str_pad($this->hora, 2, "0", STR_PAD_LEFT);
        $minuto = str_pad($this->minuto, 2, "0", STR_PAD_LEFT);
        $segundo = str_pad($this->segundo, 2, "0", STR_PAD_LEFT);
        return "$hora:$minuto:$segundo";
    }
}
