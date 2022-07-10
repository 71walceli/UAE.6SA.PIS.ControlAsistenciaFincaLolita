
const API_ROOT = "http://10.255.255.241/api/";

export const hacerLlamadaApiInterna = async (metodo, consulta, json) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(json);

    var requestOptions = {
        method: metodo,
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(`${API_ROOT}${consulta}`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => { throw error });
}

const recuperarCredenciales = () => {
    const _credenciales = JSON.parse(localStorage.getItem("credenciales"))
    if (!_credenciales)
      return
    if (Date.now() >= new Date(_credenciales.expiracion)) {
      localStorage.removeItem("credenciales")
    } 
    return _credenciales
}
