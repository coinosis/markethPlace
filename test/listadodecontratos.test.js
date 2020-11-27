const Compraventa = artifacts.require('Compraventa');
const ListadoDeContratos = artifacts.require('ListadoDeContratos');
const truffleAssert = require('truffle-assertions');

contract('ListadoDeContratos', accounts => {

  beforeEach(async function () {

    this.listado = await ListadoDeContratos.new();

  })

  describe('Acumular contratos', () => {

    it('crear un nuevo contrato de compraventa', async function () {

      const _cantidiadOriginal = this.listado.dimensionDelIndice();
      this.listado.crearCompraventa(1000000000000000000);
      const _cantidadFinal = this.listado.dimensionDelIndice();
      assert.equal(_cantidiadOriginal+1, _cantidadFinal);

    })

    it('agregar un contrato existente', async () => {
      this.compraVenta = await Compraventa.new();
    });

    it.skip('no agregar un contrato que no sea de compraventa', async () => {
    });

  });

});
