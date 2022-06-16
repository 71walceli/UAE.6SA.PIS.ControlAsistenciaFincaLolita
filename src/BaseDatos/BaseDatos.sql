
use control_asistencia_finca_lolita;

CREATE TABLE empleado (
    id BIGINT AUTO_INCREMENT,
    nombre VARCHAR(50),
    token_celular BINARY(64),
    activo BOOLEAN,
    tipo VARCHAR(1),
    PRIMARY KEY (id)
);
CREATE TABLE codigo_qr (
    id INT AUTO_INCREMENT,
    token BINARY(64),
    fecha_hora DATETIME,
    PRIMARY KEY (id)
);
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
