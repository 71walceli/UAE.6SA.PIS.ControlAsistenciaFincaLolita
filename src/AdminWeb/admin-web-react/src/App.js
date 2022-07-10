import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "rsuite";
import { Login } from "./pantallas/Login";



function App() {
  const [ credenciales, _setCredenciales ] = React.useState()
  const setCredenciales = _credenciales => {
    if (_credenciales)
      localStorage.setItem("credenciales", JSON.stringify(_credenciales))
    else
      localStorage.removeItem("credenciales")
  }

  useEffect(() => {
    const _credenciales = JSON.parse(localStorage.getItem("credenciales"))
    if (!_credenciales)
      return
    if (Date.now() >= new Date(_credenciales.expiracion)) {
      console.log("Credenciales expiradas")
      localStorage.removeItem("credenciales")
    } else {
      console.log("Sesión iniciada como "+_credenciales.nombre+".")
      _setCredenciales(_credenciales)
    }
  }, [])

  return (
    <div className="App" style={{
          width: "100vh",
          height: "100vh",
        }
      }>
      <Nav>
        <Nav.Item>Inicio</Nav.Item>
        <Nav.Item>Jornaleros</Nav.Item>
        <Nav.Item>Reportes</Nav.Item>
        <Nav.Item>Configuración</Nav.Item>
        <Nav.Item>Iniciar Sesión</Nav.Item>
      </Nav>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login 
            credenciales={credenciales} setCredenciales={setCredenciales}/>
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
    </div>
  );
}

export default App;
