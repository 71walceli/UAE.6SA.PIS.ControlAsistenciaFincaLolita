import { API_ROOT, esperar, hacerLlamadaApiInterna } from "../../ultil"
import React from "react"
import { notificar } from "../Notificaciones"

export const usePreferencias = () => {
  const API_ENDPOINT = "preferencias.php"
  const [ preferencias, setPreferencias ] = React.useState()

  const recargar = async () => {
    await (hacerLlamadaApiInterna("GET", API_ENDPOINT)
      .then(data => {
        setPreferencias(data.data.map(p => ({[p.nombre]: p.valor})))
        console.log(data.data.map(p => ({[p.nombre]: p.valor})))
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

  return [ preferencias, recargar, actualizar ]
}
