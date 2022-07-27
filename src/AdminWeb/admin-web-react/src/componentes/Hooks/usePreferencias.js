import { API_ROOT, esperar, hacerLlamadaApiInterna } from "../../ultil"
import React from "react"
import { notificar } from "../Notificaciones"

export const usePreferencias = () => {
  const API_ENDPOINT = "preferencias.php"
  const [ preferencias, setPreferencias ] = React.useState()

  const recargar = async () => {
    await (hacerLlamadaApiInterna("GET", API_ENDPOINT)
      .then(data => {
        const _data = {}
        data.data.map(p => (_data[p.nombre] = p.valor))
        setPreferencias(_data)
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
