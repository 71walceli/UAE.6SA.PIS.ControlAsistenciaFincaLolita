import React, { useRef } from "react"
import { Button, ButtonGroup, ButtonToolbar, Panel, Row, Col, Table, Grid, Modal, Form, Schema, MaskedInput, SelectPicker, Message } from "rsuite"
import { notificar } from "../componentes/Notificaciones"
import { API_ROOT, hacerLlamadaApiInterna } from "../ultil"

export const Empleados = () => {
  const TIPOS_EMPLEADOS = {
    a: "Administrador",
    j: "Jornalero",
  }

  
  const [ empleados, setEmpleados ] = React.useState([])
  {/* TODO Convertir en React Hook */}
  const cargarEmpleados = () => hacerLlamadaApiInterna("GET", "empleado.php")
    .then(respuesta => {
      if (respuesta.status === "success") {
        const datos = respuesta.data.map(empleado => 
          ({ ...empleado, id: empleado.id.toString().padStart(10, "0") })
        )
        setEmpleados(datos)
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
          onClick={() => mostrarDialogo("editar")}
        >
          Agregar empleado
        </Button>
      </ButtonToolbar>
      {empleados.map((empleado, indiceEmpleado) => {
        const estilosBotones = {
          flexGrow: 1
        }
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
              flexWrap: "wrap",
              justifyItems: "stretch",
            }}>
              <Button appearance="primary" style={estilosBotones}
                onClick={
                  () => mostrarDialogo("editar", indiceEmpleado)
                }
              >
                Editar
              </Button>
              {/*TODO Pendiente de implementar eventos de click*/}
              {empleado.tipo === "j" 
                ?<Button appearance="ghost" style={estilosBotones} onClick={
                  () => mostrarDialogo("registrarCelular", indiceEmpleado)
                }>
                  Registrar celular
                </Button>
                :<Button appearance="ghost" style={estilosBotones} onClick={ 
                  () => mostrarDialogo("cambiarContraseña", indiceEmpleado)
                }>
                  Cambiar contraseña
                </Button>
              }
              <Button appearance="ghost" color="red" onClick={
                () => mostrarDialogo("eliminar", indiceEmpleado)
              }>
                Eliminar
              </Button>
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
  const formulario = useRef()
  const [ empleado, setEmpleado ] = React.useState(props.indiceEmpleadoActual !== -1 
    ? {...props.empleado} 
    : {
      "id": "",
      "nombre": "",
      "token_celular": "",
      "activo": 1,
      "tipo": "",
    })
  const [ nuevo, setNuevo ] = React.useState(props.indiceEmpleadoActual === -1)
  // TODO Aplicarlo en Login y resto de formularios
  const [ erroresValidacion, setErroresValidacion ] = React.useState({
    "id": "Requerido",
    "nombre": "Requerido",
    "token_celular": "Requerido",
    "tipo": "Requerido",
  })

  const guardar = empleado => {
    if (props.modoDialogo === "editar") {
      hacerLlamadaApiInterna("POST", "empleado.php", empleado)
        .then(_respuesta => {
          notificar(_respuesta.message, { type: _respuesta.status })
          if (_respuesta.status === "success") {
            props.setDialogoVisible(false)
            props.cargarEmpleados()
          }
        })
    }
    if (props.modoDialogo === "cambiarContraseña") {
      hacerLlamadaApiInterna("POST", "empleado.php?registrar_celular", empleado)
        .then(_respuesta => {
          notificar(_respuesta.message, { type: _respuesta.status })
          if (_respuesta.status === "success") {
            props.setDialogoVisible(false)
            props.cargarEmpleados()
          }
        })
    }
    if (props.modoDialogo === "eliminar") {
      hacerLlamadaApiInterna("DELETE", "empleado.php", empleado)
        .then(_respuesta => {
          notificar(_respuesta.message, { type: _respuesta.status })
          if (_respuesta.status === "success") {
            props.setDialogoVisible(false)
            props.cargarEmpleados()
          }
        })
    }
  }

  const alCerrarse = () => {
    props.setModoDialogo("")
    setEmpleado({
      "id": "",
      "nombre": "",
      "token_celular": "",
      "activo": 1,
      "tipo": "",
    })
    props.setIndiceEmpleadoActual(-1)
  }

  React.useEffect(() => {
    setNuevo(props.indiceEmpleadoActual !== -1)
  }, [props.indiceEmpleadoActual])
  
  
  return <Modal open={props.dialogoVisible} onExited={alCerrarse} keyboard enforceFocus
    onEnter={() => {
        setNuevo(props.indiceEmpleadoActual !== -1)
        setEmpleado(props.indiceEmpleadoActual !== -1 
          ?{ ...props.empleados[props.indiceEmpleadoActual] } 
          :{
            "id": "",
            "nombre": "",
            "token_celular": "",
            "activo": 1,
            "tipo": "",
          }
        )
        setErroresValidacion(props.indiceEmpleadoActual === -1 
          ?{
            "id": "Requerido",
            "nombre": "Requerido",
            "token_celular": "Requerido",
            "tipo": "Requerido",
          }
          :{}
        )
    }}
  >
    {(() => {
        if (props.modoDialogo === "editar") {
          const _validadador = Schema.Model(nuevo
            ?{
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
            }
            :{
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
            }
        )

        return (
          <div>
            <Modal.Title>Editar empleado</Modal.Title>
            <Modal.Body>
              <Form style={props.style} ref={formulario}
                formValue={empleado}
                formError={erroresValidacion}
                onChange={setEmpleado}
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
                    plaintext={nuevo}
                  />
                </Form.Group>
                <Form.Group controlId="nombre">
                  <Form.ControlLabel>Nombre</Form.ControlLabel>
                  <Form.Control name="nombre" type="text" checkAsync autoComplete="off" 
                    errorPlacement="topEnd"
                  />
                </Form.Group>
                { !nuevo
                  ?<Form.Group controlId="token_celular">
                    <Form.ControlLabel>Contraseña</Form.ControlLabel>
                    <Form.Control name="token_celular" type="password" checkAsync autoComplete="off" 
                      errorPlacement="topEnd" 
                    />
                  </Form.Group>
                  : null
                }
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
        if (props.modoDialogo === "cambiarContraseña") {
          const _validadador = Schema.Model({
              token_celular: Schema.Types.StringType("Procure una contraseña segura")
                .isRequired("Requerido")
                .minLength(6, "Al menos 6 caracteres.")
                ,
              tipo: Schema.Types.StringType("Requerido").isRequired("Requerido")
            }
          )

        return (
          <div>
            <Modal.Title>Cammbiar contraseña</Modal.Title>
            <Modal.Body>
              <Form style={props.style} ref={formulario}
                formValue={empleado}
                formError={erroresValidacion}
                onChange={setEmpleado}
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
                    plaintext
                  />
                </Form.Group>
                <Form.Group controlId="nombre">
                  <Form.ControlLabel>Nombre</Form.ControlLabel>
                  <Form.Control name="nombre" type="text" checkAsync autoComplete="off" 
                    errorPlacement="topEnd" plaintext
                  />
                </Form.Group>
                <Form.Group controlId="token_celular">
                    <Form.ControlLabel>Contraseña</Form.ControlLabel>
                    <Form.Control name="token_celular" type="password" checkAsync autoComplete="off" 
                      errorPlacement="topEnd" 
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
        if (props.modoDialogo === "eliminar") {
          const _validadador = Schema.Model({})

        return (<div>
            <Modal.Title>Eliminar cuenta</Modal.Title>
            <Modal.Body>
              <Form style={props.style} ref={formulario}
                formValue={empleado}
                formError={erroresValidacion}
                onChange={setEmpleado}
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
                    plaintext
                  />
                </Form.Group>
                <Form.Group controlId="nombre">
                  <Form.ControlLabel>Nombre</Form.ControlLabel>
                  <Form.Control name="nombre" type="text" checkAsync autoComplete="off" 
                    errorPlacement="topEnd" plaintext
                  />
                </Form.Group>
                <Message type="error" style={{ fontWeight: "bold" }}>
                  La eliminación de un empleado eliminará todos sus datos. La acción es 
                  IRREVERSIBLE.
                </Message>
                <Form.Group>
                  <ButtonToolbar>
                    <Button type="submit" appearance="primary" disabled={
                      Object.entries(erroresValidacion).length !== 0
                    }>
                      Sí
                    </Button>
                    <Button appearance="default" onClick={() => props.setDialogoVisible(false)}>
                      No
                    </Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            </Modal.Body>
          </div>)
        }
        if (props.modoDialogo === "registrarCelular") {
          const _validadador = Schema.Model({})

        return (<div>
            <Modal.Title>Registrar celular</Modal.Title>
            <Modal.Body>
              <Form style={props.style} ref={formulario}
                formValue={empleado}
                formError={erroresValidacion}
                onChange={setEmpleado}
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
                    plaintext
                  />
                </Form.Group>
                <Form.Group controlId="nombre">
                  <Form.ControlLabel>Nombre</Form.ControlLabel>
                  <Form.Control name="nombre" type="text" checkAsync autoComplete="off" 
                    errorPlacement="topEnd" plaintext
                  />
                </Form.Group>
                {/* TODO Implementar una API que permita detectar cuando el teléfono se registra */}
                <Message type="info">
                  Para registrar un empleado, debe abrir la aplicación del empleado y escanear el 
                  código QR que se muestra a continuación. Una vez aparezca el nombre de su empleado
                  en la app, dé clic en <i>Aceptar</i>.
                </Message>
                <img 
                  src={`${API_ROOT}codigo_qr_visual.php?render_empleado_id=${empleado.id}`}
                  style={{
                    maxWidth: "100%"
                  }}
                />
                <Form.Group>
                  <ButtonToolbar>
                    <Button appearance="default" onClick={() => props.setDialogoVisible(false)}>
                      Aceptar
                    </Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            </Modal.Body>
          </div>)
        }
    })()}
  </Modal>
}
