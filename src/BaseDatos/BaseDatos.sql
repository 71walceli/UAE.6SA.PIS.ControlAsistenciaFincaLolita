
use control_asistencia_finca_lolita;

-- TODO Modificarlos para que usen clave primaria independiente a la cédula, siendo por esto la razón
--  de qye deban eliminarse los registros en logar de solamente inhabilitarse.
-- TODO Por lo anteriormente dicho, agregar un campo "activo"

CREATE TABLE empleado (
    id BIGINT AUTO_INCREMENT,
    nombre VARCHAR(50),
    token_celular BINARY(64),
    activo BOOLEAN,
    tipo VARCHAR(1),
    PRIMARY KEY (id)
);
CREATE VIEW empleado_vista AS
	SELECT id, nombre, tipo FROM empleado WHERE activo=1;

CREATE TABLE codigo_qr (
    id INT AUTO_INCREMENT,
    token BINARY(64),
    fecha_hora DATETIME,
    PRIMARY KEY (id)
);
CREATE VIEW codigo_qr_vista AS
	SELECT id, hex(token) token, fecha_hora FROM codigo_qr;

CREATE TABLE asistencia (
    id INT AUTO_INCREMENT,
    empleado_id BIGINT,
    codigo_qr_id INT,
    fecha_hora DATETIME,
    observacion VARCHAR(100),
    PRIMARY KEY (id),
    FOREIGN KEY (empleado_id) REFERENCES empleado(id),
    FOREIGN KEY (codigo_qr_id) REFERENCES codigo_qr(id)
);
ALTER TABLE asistencia 
	MODIFY empleado_id BIGINT NOT NULL,
    MODIFY codigo_qr_id INT NOT NULL;
CREATE VIEW asistencia_vista AS
	SELECT 
		asistencia.id, asistencia.fecha_hora asistencia_fecha_hora, observacion,
		empleado_id, empleado.nombre, 
		codigo_qr_id, codigo_qr.fecha_hora codigo_qr_fecha_hora
		FROM asistencia 
			JOIN empleado ON (empleado.id=empleado_id)
			JOIN codigo_qr ON (codigo_qr.id=codigo_qr_id)
		ORDER BY asistencia.fecha_hora;
DELIMITER \\
CREATE PROCEDURE asistencia_vista_empleado_ultima (IN _emoleado_id BIGINT)
BEGIN
	SELECT 
		asistencia.id, asistencia.fecha_hora asistencia_fecha_hora, observacion,
		empleado_id, empleado.nombre, 
		codigo_qr_id, codigo_qr.fecha_hora codigo_qr_fecha_hora
		FROM asistencia 
			JOIN empleado ON (empleado.id=empleado_id)
			JOIN codigo_qr ON (codigo_qr.id=codigo_qr_id)
		WHERE empleado_id=_emoleado_id
        ORDER BY asistencia.fecha_hora DESC
        LIMIT 1;
END\\
DELIMITER ;


CREATE TABLE preferencia (
    nombre VARCHAR(25),
    valor VARCHAR(100),
    PRIMARY KEY (nombre)
);
CREATE VIEW preferencia_vista AS 
	SELECT * FROM preferencia ORDER BY nombre;

INSERT INTO preferencia VALUES ("minHoraEntrada", "06:00");
INSERT INTO preferencia VALUES ("horaEntrada", "08:00");
INSERT INTO preferencia VALUES ("maxHoraEntrada", "11:59");
INSERT INTO preferencia VALUES ("horaReceso", "12:00");
INSERT INTO preferencia VALUES ("maxHoraReceso", "12:29");
INSERT INTO preferencia VALUES ("minHoraRecesoFin", "12:30");
INSERT INTO preferencia VALUES ("horaRecesoFin", "13:00");
INSERT INTO preferencia VALUES ("maxHoraRecesoFin", "16:59");
INSERT INTO preferencia VALUES ("horaSalida", "17:00");
INSERT INTO preferencia VALUES ("maxHoraSalida", "18:00");
INSERT INTO preferencia VALUES ("horaRegistroAsistencia", ""); -- Valor para simular hora
