const truffleAssert = require('truffle-assertions');
const BigNumber = require('bignumber.js')

const Compraventa = artifacts.require('Compraventa');
const ListadoDeContratos = artifacts.require('ListadoDeContratos');

const listadoDeContratosABI = require('../build/contracts/ListadoDeContratos.json').abi
const compraVentaABI = require('../build/contracts/Compraventa.json').abi

contract('ListadoDeContratos', accounts => {

  beforeEach(async function () {
    this.listado = await ListadoDeContratos.new();

    this.Clistado = await new web3.eth.Contract(
      listadoDeContratosABI,
      this.listado.address
    );

  })

  describe('Acumular contratos', () => {

    it('crear un nuevo contrato de compraventa', async function () {

      const _cantidiadOriginal = BigNumber(await this.listado.dimensionDelIndice.call()).toNumber();
      this.listado.crearCompraventa(BigNumber(1000000000000000000));
      const _cantidadFinal = BigNumber(await this.listado.dimensionDelIndice.call()).toNumber();

      assert.equal(_cantidiadOriginal+1, _cantidadFinal);

    })

    it('emitir un evento de ContratoListado al crar un contrato', async function () {

      const _bloqueDeInicio = await web3.eth.getBlock('latest')

      const _precio = BigNumber(1000000000000000000)
      await this.listado.crearCompraventa(BigNumber(_precio));

      const eventoDeCreadoDeContrato = await this.listado.getPastEvents(
        'ContratoListado',
        { formBlock: _bloqueDeInicio }
      )

      assert(eventoDeCreadoDeContrato.length === 1, 'Solo se debe de emitir un solo event de ContratoListado')

    })

    it('regresar una direccion instanciable', async function () {

      const _precio = BigNumber(1000000000000000000)
      await this.listado.crearCompraventa(BigNumber(_precio));

      const _cantidadFinal = BigNumber(await this.listado.dimensionDelIndice.call()).toNumber();
      const _direccionCompraventa = await this.Clistado.methods.obtieneDireccionDelContrato(_cantidadFinal - 1).call()

      const _compraventa = await new web3.eth.Contract(
        compraVentaABI,
        _direccionCompraventa
      );

      const _precioCompraventa = await _compraventa.methods.precio().call()

      assert.equal(_precio, _precioCompraventa);

    })

    it.skip('no agregar un contrato que no sea de compraventa', async () => {
    });

  });

});
