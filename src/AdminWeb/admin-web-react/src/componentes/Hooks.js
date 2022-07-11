import { esperar } from "../ultil"

export const useCredentals = async (handleCredentialsChanged) => {
  const _credenciales = JSON.parse(localStorage.getItem("credenciales"))
  if (!_credenciales || credenciales)
    return
  if (Date.now() >= new Date(_credenciales.expiracion)) {
    localStorage.removeItem("credenciales")
    notificar("Sesión cerrada por autenticación expirada", { toaster })
    return
  } 
  else {
    handleCredentialsChanged(credentials)
    notificar("¡Bienvenido "+credentials.nombre+"!", { toaster })
    return credentials
  }
}
