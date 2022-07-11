import React from "react"
import { useNavigate } from "react-router-dom"
import { Form, Button, ButtonToolbar, Toggle, Schema } from "rsuite"
import { notificar } from "../componentes/Notificaciones"
import { hacerLlamadaApiInterna } from "../ultil"


export const InicioSesión = (props) => {
  const navigate = useNavigate()

  const _validadador = Schema.Model({
    id: Schema.Types.NumberType("Sólo números se permite")
      .isRequired("Requerido")
      .addRule(value => value.length === 10, "Debe ser de 10 dígitos."),
    token_celular: Schema.Types.StringType("Procure una contraseña segura")
      .isRequired("Requerido")
      .addRule(value => value.length >= 6, "Al menos 6 caracteres.")
  })

  const [credenciales, setCredenciales] = React.useState({
    "id": "",
    "token_celular": "",
    "recordarContrasenia": true,
  })
  const [validado, setValidado] = React.useState(false)

  const iniciarSesion = async (credenciales) => {
    const resultado = await hacerLlamadaApiInterna("POST", "empleado.php?inicio_sesion",
      credenciales
    )

    if (resultado.status === "success") {
      const _credenciales = {
        id: credenciales.id,
        token_celular: credenciales.token_celular,
        nombre: resultado.data.nombre,
        expiracion: credenciales.recordarContrasenia
          ? new Date("9999-12-31T23:59:59.999")
          : new Date(new Date().setMinutes(new Date().getMinutes() + 60)),
      }
      props.setCredenciales(_credenciales)
      navigate("/")
    } else {
      notificar("Error de inisio de sesión", { type: "error" })
    }
  }

  React.useState(() => {
    document.title = "Iniciar sesión"
  }, [])

  return (
    <Form style={props.style}
      formValue={credenciales}
      onChange={setCredenciales}
      model={_validadador}
      onCheck={(validaciones) => { setValidado(Object.entries(validaciones).length === 0) }}
      onSubmit={() => iniciarSesion(credenciales)}
    >
      <Form.Group controlId="id">
        <Form.ControlLabel>Número cédula</Form.ControlLabel>
        <Form.Control name="id" type="text" checkAsync autoComplete="user" />
      </Form.Group>
      <Form.Group controlId="token_celular">
        <Form.ControlLabel>Contraseña</Form.ControlLabel>
        <Form.Control name="token_celular" type="password" checkAsync autoComplete="password" />
      </Form.Group>
      <Form.Group controlId="recordarContrasenia">
        <Form.ControlLabel>Recordar Contraseña</Form.ControlLabel>
        <Form.Control name="recordarContrasenia" accepter={Toggle}
          checked={credenciales.recordarContrasenia}
        />
        <Form.HelpText>
          {credenciales.recordarContrasenia
            ? "Su sesión no se cerrará hasta que usted la cierre manualmente."
            : "La sesión quedará disponible por máximo una hora una vez iniciada."
          }
        </Form.HelpText>
      </Form.Group>
      <Form.Group>
        <ButtonToolbar>
          <Button type="submit" appearance="primary" disabled={!validado}>
            Iniciar sesión
          </Button>
          <Button appearance="default" href="/">Cancelar</Button>
        </ButtonToolbar>
      </Form.Group>
    </Form>
  )
}
