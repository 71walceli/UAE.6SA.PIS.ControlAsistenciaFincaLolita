import { Button, Container, Content, Sidebar } from "rsuite"
import Clock from "react-live-clock"
import { API_ROOT, hacerLlamadaApiInterna } from "../ultil"
import React from "react"
import { useUltimoQr } from "../componentes/Hooks/useUltimoQr"

export const MostrarCodigoQr = props => {
  const [ ultimoQr, actualizarUltimoQr ] = useUltimoQr()

  return (<div 
    style={{
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
    }}
  >
    <Container>
      <Content>
      <img src={`${ultimoQr.qrSource}`}
        style={{
          maxHeight: "90vh"
        }}
      />
      </Content>
      <Sidebar style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
      }}>
        <h1 style={{ textAlign: "center" }}>
          <Clock
            format={'YYYY-MM-DD'}
            ticking={true}
          />
        </h1>
        <h1 style={{ textAlign: "center" }}>
          <Clock
            format={'HH:mm:ss'}
            ticking={true}
          />
        </h1>
        <div>
          <Button appearance="primary" 
            style={{ 
              margin: "auto",
            }}
            onClick={actualizarUltimoQr}
          >
            Actualizar código QR
          </Button>
          <div>
            <b>Fecha de último código QR:</b>{" "}
            <span>
              <Clock
                date={ultimoQr.fecha}
                format={'YYYY-MM-DD HH:mm:ss'}
              />
            </span>
          </div>
        </div>
      </Sidebar>
    </Container>
  </div>)
} 
