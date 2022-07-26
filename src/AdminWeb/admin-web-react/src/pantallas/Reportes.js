import React, { useEffect } from "react";
import {
  Container, Content, Header, Nav, Form, MaskedInput, SelectPicker, Button,
  ButtonToolbar, Schema, DatePicker
} from "rsuite";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import { useAsistencia } from "../componentes/Hooks/useAsistencias";
import { useEmpleados } from "../componentes/Hooks/useEmpleados";
import { usePreferencias } from "../componentes/Hooks/usePreferencias";

export const Reportes = props => {
  const [empleados] = useEmpleados()
  const [asistencias] = useAsistencia()
  const [preferencias] = usePreferencias()

  const [pestaniaActiva, setPestaniaActiva] = React.useState("reporteEmpleado")
  const [parametrosReporte, setParametrosReporte] = React.useState({
    anioMes: new Date(),
    empleadoId: "",
  })
  const [erroresValidacion, setErroresValidacion] = React.useState({
    empleadoId: "Requerido",
  })
  const [datosReporte, setDatosReporte] = React.useState()

  const _validadador = {
    anioMes: Schema.Types.DateType("Requerido").isRequired("Requerido"),
    empleadoId: Schema.Types.StringType("Requerido").isRequired("Requerido")
  }

  const obtenerAsistenciaDeEmpleado = (empleado, anioMes) => {
    // TODO Reconsiderar forma de obtener los rangos de tiempo
    // TODO Hacer función para que genere los datos de reporte de un solo empleado
    const minHoraEntrada = preferencias.filter(p => p.nombre === "minHoraEntrada")[0].valor
    const maxHoraReceso = preferencias.filter(p => p.nombre === "maxHoraReceso")[0].valor
    const minHoraRecesoFin = preferencias.filter(p => p.nombre === "minHoraRecesoFin")[0].valor
    const maxHoraSalida = preferencias.filter(p => p.nombre === "maxHoraSalida")[0].valor

    const asistenciasPorFecha = asistencias
      .filter(asistencia => 
        asistencia.empleado_id === empleado.id
        && asistencia.asistencia_fecha_hora.substring(0, 7) === anioMes
      )
      .sort((a, b) => a.asistencia_fecha_hora.localeCompare(b.asistencia_fecha_hora))
      .reduce((_asistenciasPorFecha, asistencia) => {
        const fecha = asistencia.asistencia_fecha_hora.substring(0, 10);
        _asistenciasPorFecha[fecha] = !_asistenciasPorFecha[fecha]
          ? [{ ...asistencia }] : _asistenciasPorFecha[fecha].concat([{ ...asistencia }]);
        return _asistenciasPorFecha;
      }, {});
    const asistenciasPorJornada = []
    for (let fecha in asistenciasPorFecha) {
      const asistenciasManiana = asistenciasPorFecha[fecha]
        .filter(asistencia =>
          minHoraEntrada.localeCompare(asistencia.asistencia_fecha_hora.substring(11)) < 0
          && maxHoraReceso.localeCompare(asistencia.asistencia_fecha_hora.substring(11)) > 0
        )
      const asistenciasTarde = asistenciasPorFecha[fecha]
        .filter(asistencia =>
          minHoraRecesoFin.localeCompare(asistencia.asistencia_fecha_hora.substring(11)) < 0
          && maxHoraSalida.localeCompare(asistencia.asistencia_fecha_hora.substring(11)) > 0
        )
      asistenciasPorJornada.push({
        fecha,
        manianainicio: asistenciasManiana.length > 0 
          ? asistenciasManiana[0].asistencia_fecha_hora.substring(11)
          : null,
        manianafin: asistenciasManiana.length > 1 
          ? asistenciasManiana[asistenciasManiana.length - 1].asistencia_fecha_hora.substring(11)
          : null,
        tardeinicio: asistenciasTarde.length > 0 
          ? asistenciasTarde[0].asistencia_fecha_hora.substring(11)
          : null,
        tardefin: asistenciasTarde.length > 1 
          ? asistenciasTarde[asistenciasTarde.length - 1].asistencia_fecha_hora.substring(11)
          : null,
      })
    }
    return asistenciasPorJornada
  }

  useEffect(() => {
    if (!preferencias || !asistencias || !empleados || !parametrosReporte) {
      return
    }
    const anioMes = 
      `${parametrosReporte.anioMes.getFullYear()}-${
        parametrosReporte.anioMes.getMonth().toString().padStart(2, "0")
      }`
    const empleadoAsistencia = empleados
      .filter(empleado => empleado.tipo === "j")
      .map(empleado => ({
        id: empleado.id,
        nombre: empleado.nombre,
        asistencias: obtenerAsistenciaDeEmpleado(empleado, anioMes)
      }))
    setDatosReporte(empleadoAsistencia)
  }, [asistencias, preferencias, empleados, parametrosReporte])

  return (<div>
    <Container>
      <Header>
        <Nav appearance="subtle" onSelect={e => { setPestaniaActiva(e) }} justified>
          <Nav.Item eventKey="reporteGeneral">Reporte General</Nav.Item>
          <Nav.Item eventKey="reporteEmpleado">Reporte de Empleado</Nav.Item>
        </Nav>
        <Form style={props.style} formValue={parametrosReporte} formError={erroresValidacion} 
          onChange={setParametrosReporte} model={_validadador} layout="inline"
          onCheck={(_erroresValidacion) => { setErroresValidacion(_erroresValidacion) }}
        >
          <Form.Group controlId="anioMes">
            <Form.ControlLabel>Año y Mes del reporte</Form.ControlLabel>
            <Form.Control name="anioMes" checkAsync autoComplete="off" accepter={DatePicker} 
              placeholder="2022-07" oneTap format="yyyy-MM"
            />
          </Form.Group>
          {pestaniaActiva === "reporteEmpleado"
            ?<Form.Group controlId="empleadoId">
              <Form.ControlLabel>Empleado</Form.ControlLabel>
              <Form.Control name="empleadoId" checkAsync autoComplete="off" accepter={SelectPicker}
                errorPlacement="bottomEnd"
                data={empleados && empleados
                  .filter(empleado => empleado.tipo === "j")
                  .map(empleado => 
                    ({
                      label: empleado.nombre,
                      value: empleado.id,
                    })
                  )
                }
              />
            </Form.Group>
            : null
          }
        </Form>
      </Header>
      <Content>
        {(() => {
          if (pestaniaActiva == "reporteGeneral") {
            return (<ReporteGeneral datosReporte={datosReporte} />)
          }
          else if (pestaniaActiva == "reporteEmpleado") {
            return (<ReporteInEmpleado datosReporte={datosReporte} 
              empleadoId={parametrosReporte ? parametrosReporte.empleadoId : null}
            />)
          }
        })()}
      </Content>
    </Container>
  </div>)
}

const ReporteGeneral = props => {

  return (<div>
    Reporte General
  </div>)
}
const ReporteInEmpleado = props => {
  const [ listo, setListo ] = React.useState(false)
  const [ datos, setDatos ] = React.useState()

  React.useEffect(() => {
    const _listo = props.empleadoId && props.datosReporte
    setListo(_listo)
    if (!_listo) {
      setDatos(null)
      return
    }
    const _datos = props.datosReporte
      .filter(empleado => empleado.id === props.empleadoId)[0].asistencias
    setDatos(_datos)
  }, [props.empleadoId, props.datosReporte])

  return (<div>
    {(listo)
      ?<Table>
        <Thead>
          <Tr>
            <Th>Día</Th>
            <Th>Entrada</Th>
            <Th>Inicio Receso</Th>
            <Th>Fin Receso</Th>
            <Th>Salida</Th>
          </Tr>
        </Thead>
        <Tbody>
          {datos && datos.map(fila => (
            <Tr key={fila.fecha}>
              <Td>{ fila.fecha }</Td>
              <Td>{ fila.manianainicio }</Td>
              <Td>{ fila.manianafin }</Td>
              <Td>{ fila.tardeinicio }</Td>
              <Td>{ fila.tardefin }</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      :"Cargando..."
    }
  </div>)
}
