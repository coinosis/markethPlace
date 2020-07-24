pragma solidity 0.5.16;

contract Compraventa {

    enum Estado {
        CONTRATO_CREADO,
        VENDEDOR_ENVIO_FONDOS,
        COMPRADOR_ENVIO_FONDOS,
        FONDOS_LIBERADOS
    }
    uint constant FACTOR_DEPOSITO_VENDEDOR = 1;
    uint constant FACTOR_DEPOSITO_COMPRADOR = 1;

    Estado public estado;
    uint precio;
    uint depositoVendedor;
    uint depositoComprador;
    address vendedor;
    address comprador;

    constructor (uint _precio) public {
        precio = _precio;
        depositoVendedor = _precio * FACTOR_DEPOSITO_VENDEDOR;
        depositoComprador = _precio * FACTOR_DEPOSITO_COMPRADOR;
        estado = Estado.CONTRATO_CREADO;
    }

    function enviarFondosVendedor () public payable {
        require(estado == Estado.CONTRATO_CREADO, "estado incorrecto");
        require(msg.value == depositoVendedor, "fondos incorrectos");
        vendedor = msg.sender;
        estado = Estado.VENDEDOR_ENVIO_FONDOS;
    }

    function enviarFondosComprador () public payable {
        require(estado == Estado.VENDEDOR_ENVIO_FONDOS, "estado incorrecto");
        require(msg.value == depositoComprador + precio, "fondos incorrectos");
        comprador = msg.sender;
        estado = Estado.COMPRADOR_ENVIO_FONDOS;
    }

    function liberarFondos () public {
        require(estado == Estado.COMPRADOR_ENVIO_FONDOS, "estado incorrecto");
        require(msg.sender == comprador, "emisor incorrecto");
        estado = Estado.FONDOS_LIBERADOS;
        vendedor.call.value(depositoVendedor + precio)("");
        comprador.call.value(depositoComprador)("");
    }

}
