pragma solidity 0.5.16;

import "contracts/Compraventa.sol";

contract ListadoDeContratos is Compraventa {

  address owner;

  address[] contratos;

  constructor() public {
    owner = msg.sender;
  }

  /// @notice Regresa el numero de elementos en el listado de contratos
  /// @return uint
  function dimensionDelIndice() public returns(uint) {
    return contratos.length;
  }

  /// @notice Crea una instancia de contrato de Compraventa
  /// @dev regresa la direccion nueva del contrato.
  /// @param _precio uint precio del articulo a vender en el contrato de
  ///        Compraventa
  /// @return address
  function crearCompraventa(uint _precio) public {
    Compraventa contrato = new Compraventa(_precio);
    address _direccionCompraventa = address(contrato);
    agregarCompraventa(_direccionCompraventa);
  }

  /// @notice Agregar una direccion de contrato de Compraventa al indice y retorna
  ///     su posicion.
  /// @dev regresa la direccion nueva del contrato.
  /// @param _direccionCompraventa address direccion del contrato de Compraventa
  /// @return uint
  function agregarCompraventa(address _direccionCompraventa) public returns(uint){
    contratos.push(_direccionCompraventa);
    return contratos.length - 1;
  }

}



