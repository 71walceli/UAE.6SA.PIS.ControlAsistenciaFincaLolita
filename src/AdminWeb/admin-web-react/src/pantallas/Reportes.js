import React, { useEffect } from "react";
import {
  Container, Content, Header, Nav, Form, MaskedInput, SelectPicker, Button,
  ButtonToolbar, Schema, DatePicker
} from "rsuite";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import moment from 'moment';

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
          preferencias.minHoraEntrada
            .localeCompare(asistencia.asistencia_fecha_hora.substring(11)) < 0
          && preferencias.maxHoraReceso
            .localeCompare(asistencia.asistencia_fecha_hora.substring(11)) > 0
        )
      const asistenciasTarde = asistenciasPorFecha[fecha]
        .filter(asistencia =>
          preferencias.minHoraRecesoFin
            .localeCompare(asistencia.asistencia_fecha_hora.substring(11)) < 0
          && preferencias.maxHoraSalida
            .localeCompare(asistencia.asistencia_fecha_hora.substring(11)) > 0
        )
      // TODO Manejar variables genéricas
      asistenciasPorJornada.push({
        fecha,
        manianaInicio: asistenciasManiana.length > 0 
          ? asistenciasManiana[0].asistencia_fecha_hora.substring(11)
          : null,
        manianaFin: asistenciasManiana.length > 1 
          ? asistenciasManiana[asistenciasManiana.length - 1].asistencia_fecha_hora.substring(11)
          : null,
        tardeInicio: asistenciasTarde.length > 0 
          ? asistenciasTarde[0].asistencia_fecha_hora.substring(11)
          : null,
        tardeFin: asistenciasTarde.length > 1 
          ? asistenciasTarde[asistenciasTarde.length - 1].asistencia_fecha_hora.substring(11)
          : null,
        retrasos: [
          asistenciasManiana.length > 0 
            ? asistenciasManiana[0].asistencia_fecha_hora.substring(11)
              .localeCompare(preferencias.horaEntrada) > 0
            : true
          ,
          asistenciasManiana.length > 1 
            ? asistenciasManiana[asistenciasManiana.length - 1].asistencia_fecha_hora.substring(11)
              .localeCompare(preferencias.horaReceso) < 0
            : true
          ,
          asistenciasTarde.length > 0 
            ? asistenciasTarde[0].asistencia_fecha_hora.substring(11)
              .localeCompare(preferencias.horaRecesoFin) > 0
            : true
          ,
          asistenciasTarde.length > 1 
            ? asistenciasTarde[asistenciasTarde.length - 1].asistencia_fecha_hora.substring(11)
              .localeCompare(preferencias.horaSalida) < 0
            : true
          ,]
      })
    }
    return asistenciasPorJornada.reverse()
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
        asistencias: obtenerAsistenciaDeEmpleado(empleado, anioMes),
      }))
      .map(empleado => ({
        ...empleado,
        cantidadRetrasus: empleado.asistencias.reduce((valorAnterior, registroActual) => 
          registroActual.retrasos.map(valor => valor ? 1 : 0 )
            .reduce((anterior, actual) => anterior+actual, 0) 
          + valorAnterior, 0),
        // TODO Organizar mejor el código
        cantidadInasistencias: empleado.asistencias.reduce((valorAnterior, registroActual) => (
            Number(!registroActual.manianaInicio && !registroActual.manianaFin)
              + Number(!registroActual.tardeInicio && !registroActual.tardeFin)
              + valorAnterior), 0 
          ),
        horasTotalesTrabajadas: empleado.asistencias
          .reduce((valorAnterior, registroActual) => {
            return (
              moment.duration(registroActual.manianaFin, "HH:mm")
                .subtract(moment.duration(registroActual.manianaInicio, "HH:mm"))
                .add(moment.duration(registroActual.tardeFin, "HH:mm")
                  .subtract(moment.duration(registroActual.tardeInicio, "HH:mm"))
                )
                .add(valorAnterior))
          }, moment.duration("00:00", "HH:mm")
      ).format("HH:mm").toString(),
      }))
      console.log(empleadoAsistencia)
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
  const [ preferencias ] = usePreferencias()

  React.useEffect(() => {
    const _listo = props.empleadoId && props.datosReporte
    setListo(_listo)
    if (!_listo) {
      setDatos(null)
      return
    }
    const _datos = props.datosReporte
      .filter(empleado => empleado.id === props.empleadoId)[0]
    setDatos(_datos)
  }, [props.empleadoId, props.datosReporte])

  return (<div>
    {(listo)
      ?<div>
        <Table>
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
            {datos && datos.asistencias.map(fila => (
              <Tr key={fila.fecha}>
                <Td style={{ 
                  fontWeight: "bold"
                }} >{ fila.fecha }</Td>
                {fila.manianaInicio
                  ?<Td 
                    style={{ 
                      color: 
                        fila.manianaInicio.localeCompare(preferencias.horaEntrada) < 0 ? "green" : "red"
                    }}
                  >{ fila.manianaInicio }</Td>
                  :<Td>---</Td>
                }
                {fila.manianaFin
                  ?<Td 
                    style={{ 
                      color: 
                        fila.manianaFin.localeCompare(preferencias.horaReceso) > 0 ? "green" : "red"
                    }}
                  >{ fila.manianaFin }</Td>
                  :<Td>---</Td>
                }
                {fila.tardeInicio
                  ?<Td 
                    style={{ 
                      color: 
                        fila.tardeInicio.localeCompare(preferencias.horaRecesoFin) < 0 ? "green" : "red"
                    }}
                  >{ fila.tardeInicio }</Td>
                  :<Td>---</Td>
                }
                {fila.tardeFin
                  ?<Td 
                    style={{ 
                      color: 
                        fila.tardeFin.localeCompare(preferencias.horaSalida) > 0 ? "green" : "red"
                    }}
                  >{ fila.tardeFin }</Td>
                  :<Td>---</Td>
                }
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Table>
          <Thead>
            <Tr>
              <Th>Retrasos o Salidas anticipadas</Th>
              <Th>Inasistencias</Th>
              <Th>Horas Trabajadas</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{ datos.cantidadRetrasus }</Td>
              <Td>{ datos.cantidadInasistencias }</Td>
              <Td>{ datos.horasTotalesTrabajadas }</Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
      :"Cargando..."
    }
  </div>)
}
