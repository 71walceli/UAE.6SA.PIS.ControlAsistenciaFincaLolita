
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
			JOIN codigo_qr ON (codigo_qr.id=codigo_qr_id);

CREATE TABLE preferencia (
    nombre VARCHAR(25),
    valor VARCHAR(100),
    PRIMARY KEY (nombre)
);

-- TODO Crear vistas para los métodos GET

INSERT INTO preferencia VALUES ("Min. Hora entrada", "06:00");
INSERT INTO preferencia VALUES ("Hora entrada", "08:00");
INSERT INTO preferencia VALUES ("Max. Hora entrada", "09:00");
INSERT INTO preferencia VALUES ("Hora receso", "12:00");
INSERT INTO preferencia VALUES ("Max. Hora receso", "12:30");
INSERT INTO preferencia VALUES ("Min. Hora receso fin", "12:30");
INSERT INTO preferencia VALUES ("Hora receso fin", "13:00");
INSERT INTO preferencia VALUES ("Max. Hora receso fin", "13:10");
INSERT INTO preferencia VALUES ("Hora salida", "17:00");
INSERT INTO preferencia VALUES ("Max. Hora salida", "18:00");
