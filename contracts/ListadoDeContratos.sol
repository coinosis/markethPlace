pragma solidity 0.5.16;

import "contracts/Compraventa.sol";

contract ListadoDeContratos {

  address owner;
  address[] public contratos;

  constructor() public {
    owner = msg.sender;
  }

  event ContratoListado (uint indexed indice, address indexed direccion, uint fechado);

  /// @notice Obtiene el numero de elementos en el listado de contratos
  /// @return uint
  function dimensionDelIndice() view public returns(uint) {
    return contratos.length;
  }

  /// @notice obtiene la direccion del contrato en el indice especificado
  /// @param indice posicion del indice de contratos que se require obtener
  /// @return address
  function obtieneDireccionDelContrato(uint indice) view public returns(address) {
    return contratos[indice];
  }

  /// @notice Crea una instancia de contrato de Compraventa
  /// @dev regresa la direccion nueva del contrato.
  /// @param _precio uint precio del articulo a vender en el contrato de
  ///        Compraventa
  /// @return address
  function crearCompraventa(uint _precio) public returns(address) {
    Compraventa contrato = new Compraventa(_precio);
    address _direccionCompraventa = address(contrato);
    agregarCompraventa(_direccionCompraventa);
  }

  /// @notice Agregar una direccion de contrato de Compraventa al indice y retorna
  ///     su posicion.
  /// @dev regresa la direccion nueva del contrato.
  /// @param _direccionCompraventa address direccion del contrato de Compraventa
  /// @return uint
  function agregarCompraventa(address _direccionCompraventa) public returns(uint) {
    contratos.push(_direccionCompraventa);

    emit ContratoListado(contratos.length - 1, _direccionCompraventa, now);
    return contratos.length - 1;
  }

}



