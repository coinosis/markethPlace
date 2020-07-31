const jsonContrato = require('../build/contracts/Compraventa.json');
const Web3 = require('web3');

const proveedor = Web3.givenProvider;
const web3 = new Web3(proveedor);
const infoCuenta = document.getElementById('infoCuenta');
const contrato = new web3.eth.Contract(jsonContrato.abi);
const campoPrecio = document.getElementById('campoPrecio');
const infoContrato = document.getElementById('infoContrato');
const campoContrato = document.getElementById('campoContrato');
const infoEstado = document.getElementById('infoEstado');

const estado = {
  0: 'CONTRATO_CREADO',
  1: 'VENDEDOR_ENVIO_FONDOS',
  2: 'COMPRADOR_ENVIO_FONDOS',
  3: 'FONDOS_LIBERADOS',
}

window.conectar = async () => {
  const cuentas = await web3.eth.requestAccounts();
  console.log(cuentas);
  infoCuenta.innerHTML = cuentas[0];
}

window.desplegar = async () => {
  const precioWei = web3.utils.toWei(campoPrecio.value);
  const instancia = await contrato.deploy({
    data: jsonContrato.bytecode,
    arguments: [precioWei]
  }).send({
    from: infoCuenta.innerHTML,
  });
  infoContrato.innerHTML = instancia._address;
  campoContrato.value = instancia._address;
  window.cargar();
}

window.cargar = async () => {
  const direccion = campoContrato.value;
  const instancia = new web3.eth.Contract(
    jsonContrato.abi,
    direccion
  );
  infoEstado.innerHTML = estado[
    await instancia.methods.estado().call()
  ];
}
