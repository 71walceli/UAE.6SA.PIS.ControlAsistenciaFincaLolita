
# Credenciales del servidor
- **Host**: 10.255.255.241
- **Base de datos**: control_asistencia_finca_lolita
- **Usuario**: control_asistencia_finca_lolita
- **Contraseña**: 123456789abcdef

# VPN
- **Red**: 10.255.255.240/28
- **Servidor**: 10.255.255.241

# Software necesario
- Git
    - Para acceso de Github Desktop y otras aplicaciones que usan Git
- Github Desktop
    - Gestión de los cambios, actualizaciones y sincronización de los cambios en el repositirio del proyecto
- Wireguard
    - Cliente VPN para la conexión a la red privada virtual.
    - Se debe instalar tanto en la PC como en el celular en el que van a ejecutar la aplicación
    - Los archivos para el acceso están en `ArchivosMiscelaneos/VPN`, los cuales se deben importar para poder conectarse.
- Android Studio
    - Permite trabajar de la mejor manera como el proyecto de Android.
    - Código de Android está en `src/ClienteMovil`
- Visual Studio Code
    - Para otros archivos o documentación, generalmente, el resto de los módulos en `src`
- MySQL Workbench
    - Permite conectarse directamente a la base de datos para revisar o cambiar los datos.

# Tareas
- [ ] Base de datos
- [ ] API
- [ ] Requerimientos
    - [ ] Requerimientos
        - [ ] Como jornalero necesito registrar mi asistencia escaneando un código QR, con el fun de facilitar el proceso ad administrador.
        - [ ] Como administrador, necesito obtener un reporte de asistencia general, con la finalidad de tener una vista general de las inasistencias y atrasos así como los valores a pagar y/o a ser descontados.
        - [ ] Como administrador, necesito obtener reportes por cada uno de los jornaleros, con el fin de analizar la situación de los empleados.
        - [ ] Como jornalero, necesito visualizar mi reporte de asistencia, con el fin de constarar mis asiatencias y faltas.
        - [ ] Como administtrador, necesito gestionar los empleados, con el fin de modificar datos o borrar empleadis según sea necesario.
        - [ ] Como administrador, necesito que los códigos QR se generen por cada momento de marcado, con el fin de mitigar la posibilidad de fraude.
        - [ ] Como administrador, necesito poder justificar inasistencias, con el fin de tener en cuenta feriados o situaciones de fuerza mayor.
        - [ ] Como administrador, necesito poder realizar la asistencia solo en la red inalámbrica de la finca, con el fin de que puedan registrar la asistencia solo los empleados que están.

