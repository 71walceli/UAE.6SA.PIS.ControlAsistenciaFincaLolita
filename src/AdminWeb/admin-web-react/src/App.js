import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Nav, Navbar, toaster } from "rsuite";
import { notificar } from "./componentes/Notificaciones";
import { LandingPage } from "./pantallas/LandingPage";
import { InicioSesión } from "./pantallas/Login";


function App() {
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
      window.location.href = "/"
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
        width: "96%",
        height: "100%",
        marginLeft: "2vw",
        marginRight: "2vw",
      }}
    >
      <Navbar>
        <Nav>
          <Nav.Item href="/">Inicio</Nav.Item>
          {credenciales 
            ? [
                <Nav.Item key="1">Jornaleros</Nav.Item>,
                <Nav.Item key="2">Reportes</Nav.Item>,
              ]
            : null
            }
        </Nav>
        <Nav pullRight>
          {credenciales 
            ? [
                <Nav.Item key="0">Configuración</Nav.Item>,
                <Nav.Item key="1">{ credenciales.nombre }</Nav.Item>,
                <Nav.Item key="2" 
                  onClick={() => {
                    setCredenciales(null)}
                  }
                >
                  Cerrar Sesión
                </Nav.Item>,
              ]
            : <Nav.Item href="/inicio_sesion">Iniciar Sesión</Nav.Item>
          }
        </Nav>
      </Navbar>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" 
              element={<LandingPage />} 
            />
            <Route path="/inicio_sesion" 
              element={<InicioSesión 
                credenciales={credenciales} setCredenciales={setCredenciales} 
              />} 
            />
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
