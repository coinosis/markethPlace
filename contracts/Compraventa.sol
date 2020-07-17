pragma solidity 0.5.16;

contract Compraventa {

    uint constant CONTRATO_CREADO = 1;
    uint constant VENDEDOR_ENVIO_FONDOS = 2;
    uint constant COMPRADOR_ENVIO_FONDOS = 3;
    uint constant FONDOS_LIBERADOS = 4;
    uint constant FACTOR_DEPOSITO_VENDEDOR = 1;
    uint constant FACTOR_DEPOSITO_COMPRADOR = 1;

    uint estado;
    uint precio;
    uint depositoVendedor;
    uint depositoComprador;
    address vendedor;
    address comprador;

    constructor (uint _precio) public {
        precio = _precio;
        depositoVendedor = _precio * FACTOR_DEPOSITO_VENDEDOR;
        depositoComprador = _precio * FACTOR_DEPOSITO_COMPRADOR;
        estado = CONTRATO_CREADO;
    }

    function enviarFondosVendedor () public payable {
        require(estado == CONTRATO_CREADO, "estado incorrecto");
        require(msg.value == depositoVendedor, "fondos incorrectos");
        vendedor = msg.sender;
        estado = VENDEDOR_ENVIO_FONDOS;
    }

    function enviarFondosComprador () public payable {
        require(estado == VENDEDOR_ENVIO_FONDOS, "estado incorrecto");
        require(msg.value == depositoComprador + precio, "fondos incorrectos");
        comprador = msg.sender;
        estado = COMPRADOR_ENVIO_FONDOS;
    }

    function liberarFondos () public {
        require(estado == COMPRADOR_ENVIO_FONDOS, "estado incorrecto");
        require(msg.sender == comprador, "emisor incorrecto");
        estado = FONDOS_LIBERADOS;
        vendedor.call.value(depositoVendedor + precio)("");
        comprador.call.value(depositoComprador)("");
    }

}
