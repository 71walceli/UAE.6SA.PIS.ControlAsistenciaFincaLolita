import { API_ROOT, esperar, hacerLlamadaApiInterna } from "../../ultil"
import React from "react"
import { notificar } from "../Notificaciones"

export const useAsistencia = () => {
  // TODO Usar esta variable en los otros hooks
  const API_ENDPOINT = "asistencia.php"
  const [ datos, setDatos ] = React.useState()

  const recargar = async () => {
    await (hacerLlamadaApiInterna("GET", API_ENDPOINT)
      .then(data => {
        setDatos([ ...data.data ])
      }))
  }

  React.useEffect(() => {
    recargar()
  }, [])

  const actualizar = async (preferencia) => {
    await (hacerLlamadaApiInterna("POST", API_ENDPOINT, preferencia)
      .then(data => {
        notificar(data.message, { type: data.status })
      }))
    recargar()
  }

  return [ datos, recargar, actualizar ]
}
