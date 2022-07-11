import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Message, Nav, Navbar, toaster, useToaster } from "rsuite";
import { notificar } from "./componentes/Notificaciones";
import { Login } from "./pantallas/Login";
import { esperar } from "./ultil";


function App() {
  const [ loaded, setLoaded ] = React.useState(true)
  const [ credenciales, _setCredenciales ] = React.useState()
  const setCredenciales = _credenciales => {
    if (_credenciales) {
      localStorage.setItem("credenciales", JSON.stringify(_credenciales))
      _setCredenciales(_credenciales)
      notificar(`Bienvenido ${_credenciales.nombre}`)
    }
    else {
      localStorage.removeItem("credenciales")
      _setCredenciales(null)
      notificar(`Error de inicio de sesión`, { type: "error" })
    }
  }

  const estiloGeneral = {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 80%",
    alignItems: "center",
    justifyItems: "center",
  }

  useEffect(() => {
    iniciarSesión()
  }, [])

  return (
    <div className="App" 
      style={{
        width: "96vw",
        height: "100vh",
        marginLeft: "2vw",
        marginRight: "2vw",
      }}
    >
      <Navbar>
        <Nav>
          <Nav.Item>Inicio</Nav.Item>
          {credenciales 
            ? [
                <Nav.Item key="1">Jornaleros</Nav.Item>,
                <Nav.Item key="2">Reportes</Nav.Item>,
              ]
            : null
            }
        </Nav>
        <Nav pullRight>
          <Nav.Item>Configuración</Nav.Item>
          {credenciales 
            ? [
                <Nav.Item key="0">{ credenciales.nombre }</Nav.Item>,
                <Nav.Item key="1">Cerrar Sesión</Nav.Item>,
              ]
            : <Nav.Item>Iniciar Sesión</Nav.Item>
          }
        </Nav>
      </Navbar>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Login credenciales={credenciales} setCredenciales={setCredenciales} 
                style={{}}
              />
            }>
            </Route>
            {/*
            // TODO
            <Route index element={<Home />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            */}
            <Route path="*" 
              element={
                <div>No Encontrado</div>
              } 
            />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </div>
  );

  async function iniciarSesión() {
    const _credenciales = JSON.parse(localStorage.getItem("credenciales"))
    if (!_credenciales)
      return
    if (Date.now() >= new Date(_credenciales.expiracion)) {
      localStorage.removeItem()
      setTimeout(() => {notificar("Sesión cerrada por autenticación expirada", { toaster })}, 250)
    } else {
      _setCredenciales(_credenciales)
      setTimeout(() => {notificar("¡Bienvenido "+_credenciales.nombre+"!", { toaster })}, 250)
    }
  }
}

export default App;
