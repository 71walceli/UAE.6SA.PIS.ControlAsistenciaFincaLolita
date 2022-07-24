import { API_ROOT, esperar, hacerLlamadaApiInterna } from "../../ultil"
import React from "react"
import { notificar } from "../Notificaciones"

export const useUltimoQr = () => {
  const _regargar = async () => {
    await (hacerLlamadaApiInterna("GET", "codigo_qr.php?ultimo")
      .then(data => {
        setUltimoQr({
          qrSource: `${API_ROOT}codigo_qr_visual.php?ultimo_qr=${Math.random()}`,
          fecha: new Date(data.data[0].fecha_hora),
        })
      }))
  }

  const [ ultimoQr, setUltimoQr ] = React.useState({
    qrSource: null,
    fecha: null
  })

  React.useEffect(() => {
    _regargar()
  }, [])

  const actualizar = async () => {
    await (hacerLlamadaApiInterna("POST", "codigo_qr.php?ultimo")
      .then(data => {
        setUltimoQr({
          qrSource: "notFound",
          fecha: null
        })
        notificar(data.message, { type: data.status })
      }))
    _regargar()
  }

  return [ ultimoQr, actualizar ]
}
