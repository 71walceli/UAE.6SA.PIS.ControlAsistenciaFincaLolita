import React, { useRef } from "react"
import { Button, ButtonGroup, ButtonToolbar, Panel, Row, Col, Table, Grid, Modal, Form, Schema, MaskedInput, SelectPicker } from "rsuite"
import { notificar } from "../componentes/Notificaciones"
import { hacerLlamadaApiInterna } from "../ultil"

export const Empleados = () => {
  const TIPOS_EMPLEADOS = {
    a: "Administrador",
    j: "Jornalero",
  }

  
  const [ empleados, setEmpleados ] = React.useState([])
  const cargarEmpleados = () => hacerLlamadaApiInterna("GET", "empleado.php")  
    .then(respuesta => {
      if (respuesta.status === "success") {
        setEmpleados(respuesta.data)
      }
    })
  
  const [ modoDialogo, setModoDialogo ] = React.useState("editar")
  const [ indiceEmpleadoActual, setIndiceEmpleadoActual ] = React.useState(-1)
  const [ dialogoVisible, setDialogoVisible ] = React.useState(false)
  
  React.useEffect(() => {
    cargarEmpleados()
  }, [])

  const mostrarDialogo = (_modoDialogo = "editar", _indiceEmpleadoActual = -1) => {
    setDialogoVisible(true)
    setModoDialogo(_modoDialogo)
    setIndiceEmpleadoActual(_indiceEmpleadoActual)
  }


  return (
    <div style={{
      width: "60%",
      minWidth: 320,
    }}>
      <ButtonToolbar>
        <Button 
          appearance="primary"
          onClick={() => mostrarDialogo()}
        >
          Agregar empleado
        </Button>
      </ButtonToolbar>
      {empleados.map((empleado, i) => {
        return (
          <Panel bordered header={empleado.nombre} style={{
          }}>
            <Grid fluid>
              <Row>
                <Col>
                  <div>Cédula</div>
                  <div>Tipo</div>
                </Col>
                <Col>
                  <div>{ empleado.id.toString().padStart(10, "0") }</div>
                  <div>{ TIPOS_EMPLEADOS[empleado.tipo] }</div>
                </Col>
              </Row>
            </Grid>
            <ButtonGroup style={{
              display: "flex",
              justifyContent: "right",
            }}>
              <Button type="submit" appearance="primary">
                Editar
              </Button>
              <Button appearance="ghost" color="red" href="/">Eliminar</Button>
            </ButtonGroup>
          </Panel>
        )
      })}
      {<Dialogo modoDialogo={modoDialogo} setModoDialogo={setModoDialogo} 
        cargarEmpleados={cargarEmpleados} empleados={empleados} 
        indiceEmpleadoActual={indiceEmpleadoActual} 
        setIndiceEmpleadoActual={setIndiceEmpleadoActual}
        dialogoVisible={dialogoVisible} setDialogoVisible={setDialogoVisible}
      />}
    </div>
  )
}

const Dialogo = props => {
  const _validadador = Schema.Model({
    id: Schema.Types.StringType("Debe ser de 10 dígitos.")
      .isRequired("Requerido")
      .pattern(/\d{10}/, "Debe ser de 10 dígitos.")
      .addRule(value => props.empleados.filter(e => {
            return e.id.toString().padStart(10, "0") === value.toString()
          }).length === 0
        , "Cédula existente")
      ,
    nombre: Schema.Types.StringType("Procure una contraseña segura")
      .isRequired("Requerido")
      .addRule((value, data) => (/([A-Z][a-z]+)+/.test(value))
        , "Al menos un nombre de persona correcto")
      ,
    token_celular: Schema.Types.StringType("Procure una contraseña segura")
      .isRequired("Requerido")
      .minLength(6, "Al menos 6 caracteres.")
      ,
    tipo: Schema.Types.StringType("Requerido").isRequired("Requerido")
  })

  const formulario = useRef()
  const [ empleado, setEmpleados ] = React.useState(props.indiceEmpleadoActual !== -1 
    ? {...props.empleado} 
    : {
      "id": "",
      "nombre": "",
      "token_celular": "",
      "activo": 1,
      "tipo": "",
    })
  // TODO Aplicarlo en Login y resto de formularios
  const [ erroresValidacion, setErroresValidacion ] = React.useState({
    "id": "Requerido",
    "nombre": "Requerido",
    "token_celular": "Requerido",
    "tipo": "Requerido",
  })

  const guardar = empleado => {
    hacerLlamadaApiInterna("POST", "empleado.php", empleado)
      .then(_respuesta => {
        notificar(_respuesta.message, { type: _respuesta.status })
        if (_respuesta.status === "success") {
          props.setDialogoVisible(false)
          props.cargarEmpleados()
        }
      })
  }

  React.useEffect(() => {
    props.setIndiceEmpleadoActual(-1)
  }, [])

  const alCerrarse = () => {
    props.setModoDialogo("")
    setEmpleados({
      "id": "",
      "nombre": "",
      "token_celular": "",
      "activo": 1,
      "tipo": "",
    })
  }
  return <Modal open={props.dialogoVisible} onExited={alCerrarse}
  >
    {(() => {
      if (props.modoDialogo === "editar") {
        return (
          <div>
            <Modal.Title>Editar empleado</Modal.Title>
            <Modal.Body>
              <Form style={props.style} ref={formulario}
                formValue={empleado}
                formError={erroresValidacion}
                onChange={setEmpleados}
                model={_validadador}
                onCheck={(_erroresValidacion) => { 
                    setErroresValidacion(_erroresValidacion)
                  } 
                }
                onSubmit={() => guardar(empleado)}
              >
                <Form.Group controlId="id">
                  <Form.ControlLabel>Número cédula</Form.ControlLabel>
                  <Form.Control name="id" type="text" checkAsync autoComplete="off" 
                    accepter={MaskedInput} placeholder="1234567890" errorPlacement="topEnd"
                    placeholderChar="#"
                    mask={[/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,]}
                  />
                </Form.Group>
                <Form.Group controlId="nombre">
                  <Form.ControlLabel>Nombre</Form.ControlLabel>
                  <Form.Control name="nombre" type="text" checkAsync autoComplete="off" 
                    errorPlacement="topEnd"
                  />
                </Form.Group>
                <Form.Group controlId="token_celular">
                  <Form.ControlLabel>Contraseña</Form.ControlLabel>
                  <Form.Control name="token_celular" type="password" checkAsync autoComplete="off" 
                    errorPlacement="topEnd" 
                  />
                </Form.Group>
                <Form.Group controlId="tipo">
                  <Form.ControlLabel>Tipo</Form.ControlLabel>
                  <Form.Control name="tipo" checkAsync autoComplete="off" accepter={SelectPicker} 
                    errorPlacement="rightEnd"
                    data={[
                      {
                        label: "Administrador",
                        value: "a",
                      },
                      {
                        label: "Jornalero",
                        value: "j",
                      },
                    ]}
                  />
                </Form.Group>
                <Form.Group>
                  <ButtonToolbar>
                    <Button type="submit" appearance="primary" disabled={
                      Object.entries(erroresValidacion).length !== 0
                    }>
                      Guardar
                    </Button>
                    <Button appearance="default" onClick={() => props.setDialogoVisible(false)}>
                      Cancelar
                    </Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            </Modal.Body>
          </div>
        )
      }
    })()}
  </Modal>
}
