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
    uint public precio;
    uint public depositoVendedor;
    uint public depositoComprador;
    address public vendedor;
    address public comprador;

    event CambioEstado ();

    constructor (uint _precio) public {
        precio = _precio;
        depositoVendedor = _precio * FACTOR_DEPOSITO_VENDEDOR;
        depositoComprador = _precio * FACTOR_DEPOSITO_COMPRADOR;
        estado = Estado.CONTRATO_CREADO;
    }

    modifier estadoValido(Estado _estadoReq) {
        require(estado == _estadoReq, 'Estado incorrecto');
        _;
    }

    modifier fondoCorrecto(uint _tipoDeposito) {
        require(msg.value == _tipoDeposito, 'Fondos incorrectos');
        _;
    }

    modifier onlyComprador {
        require(msg.sender == comprador, 'Emisor incorrecto');
        _;
    }

    function enviarFondosVendedor()
        public
        payable
        estadoValido(Estado.CONTRATO_CREADO)
        fondoCorrecto(depositoVendedor)
    {
        vendedor = msg.sender;
        estado = Estado.VENDEDOR_ENVIO_FONDOS;
        emit CambioEstado();
    }

    function enviarFondosComprador()
        public
        payable
        estadoValido(Estado.VENDEDOR_ENVIO_FONDOS)
        fondoCorrecto(depositoComprador + precio)
    {
        comprador = msg.sender;
        estado = Estado.COMPRADOR_ENVIO_FONDOS;
        emit CambioEstado();
    }

    function liberarFondos()
        public
        estadoValido(Estado.COMPRADOR_ENVIO_FONDOS)
        onlyComprador
    {
        estado = Estado.FONDOS_LIBERADOS;
        vendedor.call.value(depositoVendedor + precio)("");
        comprador.call.value(depositoComprador)("");
        emit CambioEstado();
    }

}
