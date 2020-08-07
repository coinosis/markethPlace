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
const infoBalance = document.getElementById('infoBalance');
const infoPrecio = document.getElementById('infoPrecio');
const infoVendedor = document.getElementById('infoVendedor');
const infoComprador = document.getElementById('infoComprador');
let instancia;
let cuentas;

const estado = {
  0: 'CONTRATO_CREADO',
  1: 'VENDEDOR_ENVIO_FONDOS',
  2: 'COMPRADOR_ENVIO_FONDOS',
  3: 'FONDOS_LIBERADOS',
}

window.conectar = async () => {
  cuentas = await web3.eth.requestAccounts();
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
  instancia = new web3.eth.Contract(
    jsonContrato.abi,
    direccion
  );
  instancia.events.CambioEstado().on('data', () => {
    window.cargar();
  });
  infoEstado.innerHTML = estado[
    await instancia.methods.estado().call()
  ];
  const precioWei = await instancia.methods.precio().call();
  const precioETH = web3.utils.fromWei(precioWei);
  infoPrecio.innerHTML = precioETH;
  const direccionComprador = await instancia.methods.comprador().call();
  if (Number(direccionComprador) == 0) {
    infoComprador.innerHTML = '(sin comprador)';
  } else {
    infoComprador.innerHTML = direccionComprador;
  }
  const direccionVendedor = await instancia.methods.vendedor().call();
  if (Number(direccionVendedor) == 0) {
    infoVendedor.innerHTML = '(sin vendedor)';
  } else {
    infoVendedor.innerHTML = direccionVendedor;
  }
  infoBalance.innerHTML = web3.utils.fromWei(
    await web3.eth.getBalance(instancia._address)
  );
}

window.enviarFondosVendedor = async () => {
  const precioWei = await instancia.methods.precio().call();
  await instancia.methods.enviarFondosVendedor().send({
    from: cuentas[0],
    value: precioWei,
  });
  window.cargar();
}

window.enviarFondosComprador = async () => {
  const precioWei = BigInt(await instancia.methods.precio().call());
  await instancia.methods.enviarFondosComprador().send({
    from: cuentas[0],
    value: String(2 * precioWei),
  });
  window.cargar();
}

window.liberarFondos = async () => {}
