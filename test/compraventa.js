const Compraventa = artifacts.require('Compraventa');
const truffleAssert = require('truffle-assertions');

contract('Compraventa', accounts => {

  const n = BigInt;
  const s = String;
  const precio = n(web3.utils.toWei('1'));
  const depositoVendedor = n(web3.utils.toWei('1'));
  const depositoComprador = n(web3.utils.toWei('1'));
  const vendedor = accounts[1];
  const comprador = accounts[2];
  const precioGas = n(50000000000);

  const estado = {
    CONTRATO_CREADO: 0,
    VENDEDOR_ENVIO_FONDOS: 1,
    COMPRADOR_ENVIO_FONDOS: 2,
    FONDOS_LIBERADOS: 3
  };

  describe('liberarFondos', () => {

    it('caso de éxito', async () => {

      const instancia = await Compraventa.new(s(precio));
      await instancia.enviarFondosVendedor({
        from: vendedor,
        value: s(depositoVendedor),
      });
      await instancia.enviarFondosComprador({
        from: comprador,
        value: s(depositoComprador + precio),
      });

      const balanceVendedorPre = n(await web3.eth.getBalance(vendedor));

      const balanceCompradorPre = n(await web3.eth.getBalance(comprador));
      const resultado = await instancia.liberarFondos({
        from: comprador,
        gasPrice: s(precioGas),
      });
      const gasUsado = n(resultado.receipt.gasUsed);
      const costoTx = precioGas * gasUsado;
      const balanceCompradorPost = n(await web3.eth.getBalance(comprador));
      assert.equal(
        s(balanceCompradorPost),
        s(balanceCompradorPre + depositoComprador - costoTx)
      );

      const balanceVendedorPost = n(await web3.eth.getBalance(vendedor));
      assert.equal(
        s(balanceVendedorPost),
        s(balanceVendedorPre + depositoVendedor + precio)
      );

      assert.equal(
        await instancia.estado(),
        estado.FONDOS_LIBERADOS
      );
      assert.equal(
        await web3.eth.getBalance(instancia.address),
        '0'
      );

    });

    it('vendedor ejecuta', async () => {
      const instancia = await Compraventa.new(s(precio));
      await instancia.enviarFondosVendedor({
        from: vendedor,
        value: s(depositoVendedor),
      });
      await instancia.enviarFondosComprador({
        from: comprador,
        value: s(depositoComprador + precio),
      });

      await truffleAssert.reverts(
        instancia.liberarFondos({
          from: vendedor,
        }),
        'emisor incorrecto'
      );

    });

  });

});
